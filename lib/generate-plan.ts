import type { SQLiteDatabase } from 'expo-sqlite';

import { BOOK_BY_SLUG } from './bible-books';
import type { SupportedLocale } from './i18n';
import { invokeFunction } from './supabase';

export type GeneratedDay = {
  day: number;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  summary: string;
};

export type StoredPassage = {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  summary: string;
};

type ApiResponse = { days: GeneratedDay[] };

export async function generatePlan(input: { theme: string; days: number; locale: SupportedLocale }) {
  return invokeFunction<typeof input, ApiResponse>('generate-plan', input);
}

// Validate each day's reference against the canonical book list, drop invalid.
export function sanitizeDays(days: GeneratedDay[]): GeneratedDay[] {
  return days.filter((d) => {
    const book = BOOK_BY_SLUG[d.book];
    if (!book) return false;
    if (!Number.isInteger(d.chapter) || d.chapter < 1) return false;
    if (!Number.isInteger(d.verse_start) || d.verse_start < 1) return false;
    if (!Number.isInteger(d.verse_end) || d.verse_end < d.verse_start) return false;
    return true;
  });
}

export async function savePlanDays(
  db: SQLiteDatabase,
  planId: number,
  days: GeneratedDay[]
) {
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    for (const d of days) {
      const passage: StoredPassage = {
        book: d.book,
        chapter: d.chapter,
        verseStart: d.verse_start,
        verseEnd: d.verse_end,
        summary: d.summary,
      };
      await db.runAsync(
        `INSERT INTO plan_days (plan_id, day_number, passages_json, generated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(plan_id, day_number) DO UPDATE SET
           passages_json = excluded.passages_json,
           generated_at = excluded.generated_at`,
        planId,
        d.day,
        JSON.stringify(passage),
        now
      );
    }
  });
}
