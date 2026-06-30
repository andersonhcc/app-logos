import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { ThemeId } from '@/lib/themes';
import { useI18n } from '@/lib/i18n';

type Choice = { label: string; hour: number; minute: number };

export default function NotificationScreen() {
  const router = useRouter();
  const { theme, days } = useLocalSearchParams<{ theme: ThemeId; days: string }>();
  const { t } = useI18n();
  const times: Choice[] = [
    { label: `06:30 — ${t('onboarding.morning')}`, hour: 6, minute: 30 },
    { label: `08:00 — ${t('onboarding.morning')}`, hour: 8, minute: 0 },
    { label: `12:00 — ${t('onboarding.lunch')}`, hour: 12, minute: 0 },
    { label: `19:00 — ${t('onboarding.evening')}`, hour: 19, minute: 0 },
    { label: `22:00 — ${t('onboarding.evening')}`, hour: 22, minute: 0 },
  ];
  const [selected, setSelected] = useState<Choice | null>(times[1]);

  const go = (notify: boolean) => {
    router.replace({
      pathname: '/(onboarding)/done',
      params: {
        theme,
        days,
        notify: notify ? '1' : '0',
        hour: selected ? String(selected.hour) : '',
        minute: selected ? String(selected.minute) : '',
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-6 pt-6">
        <View className="gap-2 mb-6">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            {t('onboarding.notificationEyebrow')}
          </Text>
          <Text variant="title" className="text-fg">
            {t('onboarding.notificationTitle')}
          </Text>
          <Text variant="body" className="text-fg-secondary">
            {t('onboarding.notificationBody')}
          </Text>
        </View>

        <View className="gap-2">
          {times.map((time) => {
            const isSelected = selected?.hour === time.hour && selected?.minute === time.minute;
            return (
              <Pressable
                key={time.label}
                onPress={() => setSelected(time)}
                className={`rounded-2xl border px-5 py-4 ${
                  isSelected
                    ? 'bg-bg-elevated border-brand'
                    : 'bg-bg-elevated border-border'
                }`}
                style={{ borderCurve: 'continuous' }}>
                <Text variant="body" className="text-fg">
                  {time.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-1" />

        <View className="gap-2 pb-4">
          <Button label={t('onboarding.enableReminder')} onPress={() => go(true)} />
          <Button label={t('onboarding.notNow')} variant="ghost" onPress={() => go(false)} />
        </View>
      </View>
    </SafeAreaView>
  );
}
