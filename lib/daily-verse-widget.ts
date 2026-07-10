import type { SQLiteDatabase } from 'expo-sqlite';

import { formatReference, getPassage } from './bible';
import { passageForDay, type PassageRef } from './curated-passages';
import type { StoredPassage } from './generate-plan';
import { getStoredLocale, type SupportedLocale } from './i18n';
import { getActivePlan, getLatestPlan, getPlan, getPlanDay } from './plans';
import { prefs } from './preferences';
import { getTheme, type ThemeId } from './themes';
import { saveDailyVerseWidgetSnapshot } from './native-daily-verse-widget';

export type DailyVerseWidgetSnapshot = {
  locale: SupportedLocale;
  reference: string;
  verseText: string;
  themeLabel: string;
  currentDay: number;
  totalDays: number;
  hasActivePlan: boolean;
  updatedAt: number;
};

const FALLBACK_THEME: ThemeId = 'paz';
const FALLBACK_DAYS = 7;

export async function syncDailyVerseWidget(db: SQLiteDatabase) {
  const snapshot = await buildDailyVerseWidgetSnapshot(db);
  if (!snapshot) return false;
  return saveDailyVerseWidgetSnapshot(JSON.stringify(snapshot));
}

async function buildDailyVerseWidgetSnapshot(db: SQLiteDatabase): Promise<DailyVerseWidgetSnapshot | null> {
  const selectedId = prefs.getActivePlanId();
  const selectedPlan = selectedId ? await getPlan(db, selectedId) : null;
  const selectablePlan = selectedPlan?.status === 'abandoned' ? null : selectedPlan;
  const plan = selectablePlan ?? await getActivePlan(db) ?? await getLatestPlan(db);

  const locale = plan?.locale ?? getStoredLocale();
  const themeId = plan?.theme ?? FALLBACK_THEME;
  const theme = getTheme(themeId, locale);
  const currentDay = plan?.current_day ?? fallbackDay();
  const totalDays = plan?.days_count ?? FALLBACK_DAYS;
  const ref = plan ? await getPlanPassageRef(db, plan.id, currentDay, themeId) : passageForDay(themeId, currentDay);
  const passage = await getPassage(db, ref, locale);
  const verse = passage?.verses[0]?.text?.replace(/\s+/g, ' ').trim();

  if (!passage || !verse) return null;

  return {
    locale,
    reference: formatReference(passage),
    verseText: verse,
    themeLabel: theme?.label ?? '',
    currentDay,
    totalDays,
    hasActivePlan: !!plan && plan.status === 'active',
    updatedAt: Date.now(),
  };
}

async function getPlanPassageRef(
  db: SQLiteDatabase,
  planId: number,
  day: number,
  theme: ThemeId,
): Promise<PassageRef> {
  const dayRecord = await getPlanDay(db, planId, day);
  if (!dayRecord?.passages_json) return passageForDay(theme, day);

  try {
    const stored = JSON.parse(dayRecord.passages_json) as StoredPassage;
    return {
      book: stored.book,
      chapter: stored.chapter,
      verseStart: stored.verseStart,
      verseEnd: stored.verseEnd,
    };
  } catch {
    return passageForDay(theme, day);
  }
}

function fallbackDay() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  return ((dayOfYear - 1) % FALLBACK_DAYS) + 1;
}
