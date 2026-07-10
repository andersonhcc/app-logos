import type { SQLiteDatabase } from 'expo-sqlite';

import { BOOK_BY_ABBREV, BOOK_BY_SLUG, BOOKS, type BookDef } from './bible-books';
import { localizeBook } from './bible-books';
import type { SupportedLocale } from './i18n';

export type RawBibleBook = {
  abbrev: string;
  name?: string;
  chapters: string[][];
};

export type Verse = {
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
};

export type Passage = {
  book: BookDef;
  chapter: number;
  verses: { verse: number; text: string }[];
};

export type BibleSearchResult = {
  book: BookDef;
  chapter: number;
  verse: number;
  text: string;
};

const BIBLE_VERSION_KEY = 'version';
const CURRENT_BIBLE_VERSION = 'bilingual-1';

export async function isBibleBootstrapped(db: SQLiteDatabase): Promise<boolean> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM bible_meta WHERE key = ?',
    BIBLE_VERSION_KEY
  );
  return row?.value === CURRENT_BIBLE_VERSION;
}

export async function bootstrapBible(db: SQLiteDatabase, datasets: Record<SupportedLocale, RawBibleBook[]>) {
  if (await isBibleBootstrapped(db)) return;
  if (Object.values(datasets).some((raw) => !Array.isArray(raw) || raw.length === 0)) {
    throw new Error('Bible JSON is empty — run `npm run fetch:bible` first.');
  }

  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM bible_verses; DELETE FROM bible_books;');

    for (const locale of Object.keys(datasets) as SupportedLocale[]) {
      for (const canonical of BOOKS) {
        const b = localizeBook(canonical, locale);
        await db.runAsync(
          'INSERT INTO bible_books (locale, id, slug, abbrev, name, testament, book_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
          locale, b.id, b.slug, b.abbrev, b.name, b.testament, b.id
        );
      }
    }

    const stmt = await db.prepareAsync(
      'INSERT INTO bible_verses (locale, book_id, chapter, verse, text) VALUES (?, ?, ?, ?, ?)'
    );
    try {
      for (const locale of Object.keys(datasets) as SupportedLocale[]) {
       for (const rb of datasets[locale]) {
        const book = BOOK_BY_ABBREV[rb.abbrev.toLowerCase()];
        if (!book) {
          console.warn(`[bible] unknown book abbrev: ${rb.abbrev}`);
          continue;
        }
        for (let c = 0; c < rb.chapters.length; c++) {
          const verses = rb.chapters[c];
          for (let v = 0; v < verses.length; v++) {
            await stmt.executeAsync(locale, book.id, c + 1, v + 1, verses[v]);
          }
        }
       }
      }
    } finally {
      await stmt.finalizeAsync();
    }

    await db.runAsync(
      'INSERT OR REPLACE INTO bible_meta (key, value) VALUES (?, ?)',
      BIBLE_VERSION_KEY,
      CURRENT_BIBLE_VERSION
    );
  });
}

export async function getVerse(
  db: SQLiteDatabase,
  ref: { book: string; chapter: number; verse: number }, locale: SupportedLocale
) {
  const book = BOOK_BY_SLUG[ref.book] ?? BOOK_BY_ABBREV[ref.book];
  if (!book) return null;
  return db.getFirstAsync<Verse>(
    'SELECT * FROM bible_verses WHERE locale = ? AND book_id = ? AND chapter = ? AND verse = ?',
    locale,
    book.id,
    ref.chapter,
    ref.verse
  );
}

export async function getPassage(
  db: SQLiteDatabase,
  ref: { book: string; chapter: number; verseStart: number; verseEnd?: number }, locale: SupportedLocale
): Promise<Passage | null> {
  const book = BOOK_BY_SLUG[ref.book] ?? BOOK_BY_ABBREV[ref.book];
  if (!book) return null;
  const end = ref.verseEnd ?? ref.verseStart;
  const rows = await db.getAllAsync<{ verse: number; text: string }>(
    'SELECT verse, text FROM bible_verses WHERE locale = ? AND book_id = ? AND chapter = ? AND verse BETWEEN ? AND ? ORDER BY verse',
    locale,
    book.id,
    ref.chapter,
    ref.verseStart,
    end
  );
  return { book: localizeBook(book, locale), chapter: ref.chapter, verses: rows };
}

export async function getChapter(
  db: SQLiteDatabase,
  ref: { book: string; chapter: number },
  locale: SupportedLocale,
) {
  const book = BOOK_BY_SLUG[ref.book] ?? BOOK_BY_ABBREV[ref.book];
  if (!book) return null;
  const rows = await db.getAllAsync<{ verse: number; text: string }>(
    'SELECT verse, text FROM bible_verses WHERE locale = ? AND book_id = ? AND chapter = ? ORDER BY verse',
    locale,
    book.id,
    ref.chapter,
  );
  return { book: localizeBook(book, locale), chapter: ref.chapter, verses: rows };
}

export async function searchBible(
  db: SQLiteDatabase,
  query: string,
  locale: SupportedLocale,
  limit = 30,
): Promise<BibleSearchResult[]> {
  const term = query.trim();
  if (term.length < 2) return [];
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const reference = term.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
  if (reference) {
    const bookTerm = normalize(reference[1]);
    const matchedBook = BOOKS.find((book) => {
      const localized = localizeBook(book, locale);
      return normalize(localized.name) === bookTerm || normalize(book.abbrev) === bookTerm || normalize(book.slug) === bookTerm;
    });
    if (matchedBook) {
      const chapter = Number(reference[2]);
      const verse = reference[3] ? Number(reference[3]) : null;
      const rows = await db.getAllAsync<Verse>(
        `SELECT book_id, chapter, verse, text FROM bible_verses
          WHERE locale = ? AND book_id = ? AND chapter = ? AND (? IS NULL OR verse = ?)
          ORDER BY verse LIMIT ?`,
        locale, matchedBook.id, chapter, verse, verse, limit,
      );
      return rows.map((row) => ({ ...row, book: localizeBook(matchedBook, locale) }));
    }
  }
  const rows = await db.getAllAsync<Verse & { name: string; slug: string; abbrev: string; testament: 'AT' | 'NT' }>(
    `SELECT v.book_id, v.chapter, v.verse, v.text, b.name, b.slug, b.abbrev, b.testament
       FROM bible_verses v JOIN bible_books b ON b.locale = v.locale AND b.id = v.book_id
      WHERE v.locale = ? AND (v.text LIKE ? OR b.name LIKE ? OR b.abbrev LIKE ?)
      ORDER BY CASE WHEN b.name LIKE ? THEN 0 ELSE 1 END, b.book_order, v.chapter, v.verse
      LIMIT ?`,
    locale,
    `%${term}%`,
    `%${term}%`,
    `${term}%`,
    `${term}%`,
    limit,
  );
  return rows.map((row) => ({
    book: { id: row.book_id, name: row.name, slug: row.slug, abbrev: row.abbrev, testament: row.testament },
    chapter: row.chapter,
    verse: row.verse,
    text: row.text,
  }));
}

export function formatReference(p: Pick<Passage, 'book' | 'chapter' | 'verses'>) {
  if (p.verses.length === 0) return `${p.book.name} ${p.chapter}`;
  const first = p.verses[0].verse;
  const last = p.verses[p.verses.length - 1].verse;
  return first === last
    ? `${p.book.name} ${p.chapter}:${first}`
    : `${p.book.name} ${p.chapter}:${first}-${last}`;
}
