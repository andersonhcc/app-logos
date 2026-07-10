import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useI18n } from '@/lib/i18n';
import { listPlans, type PlanSummary, type PlanStatus } from '@/lib/plans';
import { getTheme } from '@/lib/themes';
import { useThemeColors } from '@/theme';

export default function PlansScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useI18n();
  const [plans, setPlans] = useState<PlanSummary[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void listPlans(db).then((items) => active && setPlans(items));
      return () => { active = false; };
    }, [db])
  );

  if (!plans) {
    return <View className="flex-1 items-center justify-center bg-bg-base"><ActivityIndicator color={colors.brand.primary} /></View>;
  }

  const statusLabel = (status: PlanStatus) => t(`plans.status.${status}`);

  return (
    <ScrollView className="flex-1 bg-bg-base" contentContainerStyle={{ padding: 20, gap: 12 }}>
      {plans.map((plan) => (
        <Pressable
          key={plan.id}
          accessibilityRole="button"
          onPress={() => router.push(`/plans/${plan.id}`)}
          className="rounded-2xl border border-border bg-bg-elevated p-5 gap-2 active:opacity-80">
          <View className="flex-row items-center justify-between gap-4">
            <Text variant="subtitle" className="flex-1">{getTheme(plan.theme, plan.locale)?.label ?? plan.theme}</Text>
            <Text variant="caption" className="text-brand">{statusLabel(plan.status)}</Text>
          </View>
          <Text variant="bodySmall" className="text-fg-secondary">
            {t('plans.progress', { completed: plan.completed_days, total: plan.days_count })}
          </Text>
          <Text variant="caption" className="text-fg-tertiary">{t('plans.viewDays')}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
