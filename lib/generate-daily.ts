import type { SQLiteDatabase } from 'expo-sqlite';

import { invokeFunction } from './supabase';
import type { SupportedLocale } from './i18n';

export type DailyContent = {
  reflection: string;
  prayer: string;
};

type Input = {
  theme: string;
  reference: string;
  passageText: string;
  day: number;
  totalDays: number;
  locale: SupportedLocale;
};

export async function generateDaily(input: Input) {
  return invokeFunction<Input, DailyContent>('generate-daily', input);
}

export async function saveDailyContent(
  db: SQLiteDatabase,
  planId: number,
  day: number,
  content: DailyContent
) {
  await db.runAsync(
    `UPDATE plan_days
       SET reflection = ?, prayer = ?, generated_at = ?
     WHERE plan_id = ? AND day_number = ?`,
    content.reflection,
    content.prayer,
    Date.now(),
    planId,
    day
  );
}
