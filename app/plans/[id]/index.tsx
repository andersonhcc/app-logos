import { type Href, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useI18n } from '@/lib/i18n';
import { formatStoredPassage, parseStoredPassage } from '@/lib/plan-history';
import { getPlan, listPlanDays, type Plan, type PlanDay } from '@/lib/plans';
import { getTheme } from '@/lib/themes';
import { useThemeColors } from '@/theme';

type State = { plan: Plan; days: PlanDay[] } | null;

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const planId = Number(id);
  const db = useSQLiteContext();
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useI18n();
  const [state, setState] = useState<State>();

  useEffect(() => {
    let active = true;
    void Promise.all([getPlan(db, planId), listPlanDays(db, planId)]).then(([plan, days]) => {
      if (active) setState(plan ? { plan, days } : null);
    });
    return () => { active = false; };
  }, [db, planId]);

  if (state === undefined) {
    return <View className="flex-1 items-center justify-center bg-bg-base"><ActivityIndicator color={colors.brand.primary} /></View>;
  }
  if (!state) {
    return <View className="flex-1 items-center justify-center bg-bg-base px-6"><Text>{t('plans.notFound')}</Text></View>;
  }

  const { plan, days } = state;
  const theme = getTheme(plan.theme, plan.locale);
  const records = new Map(days.map((day) => [day.day_number, day]));

  return (
    <ScrollView className="flex-1 bg-bg-base" contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 48 }}>
      <Stack.Screen options={{ title: theme?.label ?? t('plans.planDetails') }} />
      <View className="mb-2 gap-1">
        <Text variant="title">{theme?.label ?? plan.theme}</Text>
        <Text variant="bodySmall" className="text-fg-secondary">
          {t(`plans.status.${plan.status}`)} · {t('onboarding.days', { count: plan.days_count })}
        </Text>
      </View>

      {Array.from({ length: plan.days_count }, (_, index) => index + 1).map((dayNumber) => {
        const record = records.get(dayNumber);
        const passage = parseStoredPassage(record?.passages_json ?? null);
        return (
          <Pressable
            key={dayNumber}
            accessibilityRole="button"
            onPress={() => router.push(`/plans/${plan.id}/${dayNumber}` as Href)}
            className="rounded-2xl border border-border bg-bg-elevated p-4 gap-1 active:opacity-80">
            <View className="flex-row items-center justify-between gap-4">
              <Text variant="subtitle">{t('plans.day', { day: dayNumber })}</Text>
              <Text variant="caption" className={record?.completed_at ? 'text-brand' : 'text-fg-tertiary'}>
                {record?.completed_at ? t('plans.dayCompleted') : t('plans.dayNotCompleted')}
              </Text>
            </View>
            <Text variant="bodySmall" className="text-fg-secondary">
              {passage ? formatStoredPassage(passage, plan.locale) : t('plans.contentUnavailable')}
            </Text>
            {!!record?.reflection && (
              <Text variant="bodySmall" className="text-fg-tertiary" numberOfLines={2}>{record.reflection}</Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
