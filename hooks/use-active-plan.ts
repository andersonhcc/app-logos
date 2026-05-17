import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { getPassage, type Passage } from '@/lib/bible';
import { passageForDay, type PassageRef } from '@/lib/curated-passages';
import type { StoredPassage } from '@/lib/generate-plan';
import {
  getActivePlan,
  getPlanDay,
  markDayCompleted,
  type Plan,
  type PlanDay,
} from '@/lib/plans';
import { getTheme, type ThemeDef } from '@/lib/themes';

export type ActivePlanState = {
  loading: boolean;
  plan: Plan | null;
  theme: ThemeDef | null;
  dayRecord: PlanDay | null;
  passage: Passage | null;
};

export function useActivePlan() {
  const db = useSQLiteContext();
  const [state, setState] = useState<ActivePlanState>({
    loading: true,
    plan: null,
    theme: null,
    dayRecord: null,
    passage: null,
  });

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const plan = await getActivePlan(db);
    if (!plan) {
      setState({ loading: false, plan: null, theme: null, dayRecord: null, passage: null });
      return;
    }
    const theme = getTheme(plan.theme) ?? null;
    const dayRecord = (await getPlanDay(db, plan.id, plan.current_day)) ?? null;

    let ref: PassageRef | null = null;
    if (dayRecord?.passages_json) {
      try {
        const stored = JSON.parse(dayRecord.passages_json) as StoredPassage;
        ref = {
          book: stored.book,
          chapter: stored.chapter,
          verseStart: stored.verseStart,
          verseEnd: stored.verseEnd,
        };
      } catch {
        ref = null;
      }
    }
    if (!ref && theme) {
      ref = passageForDay(theme.id, plan.current_day);
    }
    const passage = ref ? await getPassage(db, ref) : null;
    setState({ loading: false, plan, theme, dayRecord, passage });
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const completeToday = useCallback(async () => {
    if (!state.plan) return;
    await markDayCompleted(db, state.plan.id, state.plan.current_day);
    await reload();
  }, [db, reload, state.plan]);

  return { ...state, reload, completeToday };
}
