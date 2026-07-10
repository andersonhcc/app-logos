import { Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { formatReference, getPassage, type Passage } from '@/lib/bible';
import { useI18n } from '@/lib/i18n';
import { parseStoredPassage } from '@/lib/plan-history';
import { getPlan, getPlanDay, type Plan, type PlanDay } from '@/lib/plans';
import { useThemeColors } from '@/theme';

type State = { plan: Plan; day: PlanDay | null; passage: Passage | null } | null;

export default function PlanDayDetailsScreen() {
  const { id, day } = useLocalSearchParams<{ id: string; day: string }>();
  const planId = Number(id);
  const dayNumber = Number(day);
  const db = useSQLiteContext();
  const colors = useThemeColors();
  const { t } = useI18n();
  const [state, setState] = useState<State>();

  useEffect(() => {
    let active = true;
    void (async () => {
      const [plan, dayRecord] = await Promise.all([
        getPlan(db, planId),
        getPlanDay(db, planId, dayNumber),
      ]);
      if (!plan) {
        if (active) setState(null);
        return;
      }
      const stored = parseStoredPassage(dayRecord?.passages_json ?? null);
      const passage = stored ? await getPassage(db, stored, plan.locale) : null;
      if (active) setState({ plan, day: dayRecord ?? null, passage });
    })();
    return () => { active = false; };
  }, [dayNumber, db, planId]);

  if (state === undefined) {
    return <View className="flex-1 items-center justify-center bg-bg-base"><ActivityIndicator color={colors.brand.primary} /></View>;
  }
  if (!state) {
    return <View className="flex-1 items-center justify-center bg-bg-base px-6"><Text>{t('plans.notFound')}</Text></View>;
  }

  const title = t('plans.day', { day: dayNumber });
  return (
    <ScrollView className="flex-1 bg-bg-base" contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 48 }}>
      <Stack.Screen options={{ title }} />
      <View className="gap-1">
        <Text variant="title">{title}</Text>
        <Text variant="bodySmall" className="text-fg-secondary">
          {state.passage ? formatReference(state.passage) : t('plans.contentUnavailable')}
        </Text>
      </View>

      {state.passage && state.passage.verses.length > 0 && (
        <HistorySection title={t('today.reading')}>
          <Text variant="citation" selectable>
            {state.passage.verses.map((verse) => `${verse.verse}. ${verse.text}`).join('\n\n')}
          </Text>
        </HistorySection>
      )}
      <HistorySection title={t('today.reflection')}>
        <Text variant="body" className={state.day?.reflection ? 'text-fg' : 'text-fg-tertiary'} selectable>
          {state.day?.reflection ?? t('plans.notGenerated')}
        </Text>
      </HistorySection>
      <HistorySection title={t('today.prayer')}>
        <Text variant="citation" className={state.day?.prayer ? 'text-fg' : 'text-fg-tertiary'} selectable>
          {state.day?.prayer ?? t('plans.notGenerated')}
        </Text>
      </HistorySection>
    </ScrollView>
  );
}

function HistorySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="rounded-2xl border border-border bg-bg-elevated p-5 gap-3">
      <Text variant="subtitle" className="text-brand">{title}</Text>
      {children}
    </View>
  );
}
