import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { getPassage, type Passage } from '@/lib/bible';
import { passageForDay, type PassageRef } from '@/lib/curated-passages';
import type { StoredPassage } from '@/lib/generate-plan';
import {
  getActivePlan,
  getLatestPlan,
  getPlan,
  getPlanDay,
  markDayCompleted,
  type Plan,
  type PlanDay,
} from '@/lib/plans';
import { prefs } from '@/lib/preferences';
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
    const selectedId = prefs.getActivePlanId();
    const selectedPlan = selectedId ? await getPlan(db, selectedId) : null;
    const selectablePlan = selectedPlan?.status === 'abandoned' ? null : selectedPlan;
    const plan = selectablePlan ?? await getActivePlan(db) ?? await getLatestPlan(db);
    if (!plan) {
      setState({ loading: false, plan: null, theme: null, dayRecord: null, passage: null });
      return;
    }
    const theme = getTheme(plan.theme, plan.locale) ?? null;
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
    const passage = ref ? await getPassage(db, ref, plan.locale) : null;
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
