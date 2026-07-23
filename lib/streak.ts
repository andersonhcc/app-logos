import type { SQLiteDatabase } from 'expo-sqlite';

import type { SupportedLocale } from './i18n';

const DAY_MS = 86_400_000;

export type StreakCelebration = {
  streak: number;
  best: number;
  week: boolean[];
  todayIndex: number;
};

export const WEEK_DAY_LETTERS: Record<SupportedLocale, string[]> = {
  'pt-BR': ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

function localDayKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function shiftedDayKey(base: Date, offsetDays: number) {
  return localDayKey(
    new Date(base.getFullYear(), base.getMonth(), base.getDate() + offsetDays)
  );
}

async function getCompletionDayKeys(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ completed_at: number }>(
    'SELECT completed_at FROM plan_days WHERE completed_at IS NOT NULL'
  );
  return new Set(rows.map((row) => localDayKey(new Date(row.completed_at))));
}

function currentStreakFrom(days: Set<string>, now: Date) {
  let offset = days.has(localDayKey(now)) ? 0 : -1;
  let streak = 0;
  while (days.has(shiftedDayKey(now, offset))) {
    streak++;
    offset--;
  }
  return streak;
}

function bestStreakFrom(days: Set<string>) {
  const ordinals = [...days]
    .map((key) => Math.round(Date.parse(`${key}T00:00:00Z`) / DAY_MS))
    .sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let previous: number | null = null;
  for (const ordinal of ordinals) {
    run = previous !== null && ordinal === previous + 1 ? run + 1 : 1;
    if (run > best) best = run;
    previous = ordinal;
  }
  return best;
}

export async function getCurrentStreak(db: SQLiteDatabase) {
  return currentStreakFrom(await getCompletionDayKeys(db), new Date());
}

export async function getStreakCelebration(
  db: SQLiteDatabase
): Promise<StreakCelebration> {
  const days = await getCompletionDayKeys(db);
  const now = new Date();
  const todayIndex = now.getDay();
  const week = Array.from({ length: 7 }, (_, index) =>
    days.has(shiftedDayKey(now, index - todayIndex))
  );
  return {
    streak: currentStreakFrom(days, now),
    best: bestStreakFrom(days),
    week,
    todayIndex,
  };
}
