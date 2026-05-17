import type { SQLiteDatabase } from 'expo-sqlite';

import { BOOK_BY_ABBREV, BOOK_BY_SLUG, BOOKS, type BookDef } from './bible-books';

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

const BIBLE_VERSION_KEY = 'version';
const CURRENT_BIBLE_VERSION = 'aa-1';

export async function isBibleBootstrapped(db: SQLiteDatabase): Promise<boolean> {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM bible_meta WHERE key = ?',
    BIBLE_VERSION_KEY
  );
  return row?.value === CURRENT_BIBLE_VERSION;
}

export async function bootstrapBible(db: SQLiteDatabase, raw: RawBibleBook[]) {
  if (await isBibleBootstrapped(db)) return;
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('Bible JSON is empty — run `npm run fetch:bible` first.');
  }

  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM bible_verses; DELETE FROM bible_books;');

    for (const b of BOOKS) {
      await db.runAsync(
        'INSERT INTO bible_books (id, slug, abbrev, name, testament, book_order) VALUES (?, ?, ?, ?, ?, ?)',
        b.id,
        b.slug,
        b.abbrev,
        b.name,
        b.testament,
        b.id
      );
    }

    const stmt = await db.prepareAsync(
      'INSERT INTO bible_verses (book_id, chapter, verse, text) VALUES (?, ?, ?, ?)'
    );
    try {
      for (const rb of raw) {
        const book = BOOK_BY_ABBREV[rb.abbrev.toLowerCase()];
        if (!book) {
          console.warn(`[bible] unknown book abbrev: ${rb.abbrev}`);
          continue;
        }
        for (let c = 0; c < rb.chapters.length; c++) {
          const verses = rb.chapters[c];
          for (let v = 0; v < verses.length; v++) {
            await stmt.executeAsync(book.id, c + 1, v + 1, verses[v]);
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
  ref: { book: string; chapter: number; verse: number }
) {
  const book = BOOK_BY_SLUG[ref.book] ?? BOOK_BY_ABBREV[ref.book];
  if (!book) return null;
  return db.getFirstAsync<Verse>(
    'SELECT * FROM bible_verses WHERE book_id = ? AND chapter = ? AND verse = ?',
    book.id,
    ref.chapter,
    ref.verse
  );
}

export async function getPassage(
  db: SQLiteDatabase,
  ref: { book: string; chapter: number; verseStart: number; verseEnd?: number }
): Promise<Passage | null> {
  const book = BOOK_BY_SLUG[ref.book] ?? BOOK_BY_ABBREV[ref.book];
  if (!book) return null;
  const end = ref.verseEnd ?? ref.verseStart;
  const rows = await db.getAllAsync<{ verse: number; text: string }>(
    'SELECT verse, text FROM bible_verses WHERE book_id = ? AND chapter = ? AND verse BETWEEN ? AND ? ORDER BY verse',
    book.id,
    ref.chapter,
    ref.verseStart,
    end
  );
  return { book, chapter: ref.chapter, verses: rows };
}

export function formatReference(p: Pick<Passage, 'book' | 'chapter' | 'verses'>) {
  if (p.verses.length === 0) return `${p.book.name} ${p.chapter}`;
  const first = p.verses[0].verse;
  const last = p.verses[p.verses.length - 1].verse;
  return first === last
    ? `${p.book.name} ${p.chapter}:${first}`
    : `${p.book.name} ${p.chapter}:${first}-${last}`;
}
