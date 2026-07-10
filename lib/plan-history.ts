import { BOOK_BY_SLUG, localizeBook } from './bible-books';
import type { StoredPassage } from './generate-plan';
import type { SupportedLocale } from './i18n';

export function parseStoredPassage(value: string | null): StoredPassage | null {
  if (!value) return null;
  try {
    const passage = JSON.parse(value) as StoredPassage;
    if (!passage.book || !Number.isInteger(passage.chapter)) return null;
    return passage;
  } catch {
    return null;
  }
}

export function formatStoredPassage(passage: StoredPassage, locale: SupportedLocale) {
  const book = BOOK_BY_SLUG[passage.book];
  const bookName = book ? localizeBook(book, locale).name : passage.book;
  const verses = passage.verseStart === passage.verseEnd
    ? `${passage.verseStart}`
    : `${passage.verseStart}-${passage.verseEnd}`;
  return `${bookName} ${passage.chapter}:${verses}`;
}
