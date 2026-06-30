import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { DURATIONS, type Duration, type ThemeId } from '@/lib/themes';
import { useI18n } from '@/lib/i18n';

export default function DurationScreen() {
  const router = useRouter();
  const { theme } = useLocalSearchParams<{ theme: ThemeId }>();
  const [days, setDays] = useState<Duration | null>(null);
  const { t } = useI18n();

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-6 pt-6">
        <View className="gap-2 mb-8">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            {t('onboarding.durationEyebrow')}
          </Text>
          <Text variant="title" className="text-fg">
            {t('onboarding.durationTitle')}
          </Text>
          <Text variant="body" className="text-fg-secondary">
            {t('onboarding.durationBody')}
          </Text>
        </View>

        <View className="gap-3">
          {DURATIONS.map((d) => {
            const isSelected = days === d;
            return (
              <Pressable
                key={d}
                onPress={() => setDays(d)}
                className={`flex-row items-center justify-between rounded-2xl border px-5 py-5 ${
                  isSelected
                    ? 'bg-bg-elevated border-brand'
                    : 'bg-bg-elevated border-border'
                }`}
                style={{ borderCurve: 'continuous' }}>
                <View>
                  <Text variant="title" className="text-fg">
                    {t('onboarding.days', { count: d })}
                  </Text>
                  <Text variant="bodySmall" className="text-fg-secondary">
                    {d === 7
                      ? t('onboarding.duration7')
                      : d === 14
                        ? t('onboarding.duration14')
                        : t('onboarding.duration30')}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-1" />

        <View className="pb-4">
          <Button
            label={t('common.continue')}
            disabled={!days}
            onPress={() =>
              days &&
              (router.push as any)({
                pathname: '/(onboarding)/notification',
                params: { theme, days: String(days) },
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
