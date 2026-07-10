import { SymbolView } from 'expo-symbols';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAnalytics } from '@/lib/analytics';
import { AnalyticsEvents, normalizeAnalyticsFlow } from '@/lib/analytics-events';
import { getTheme, THEMES, type ThemeId } from '@/lib/themes';
import { useI18n } from '@/lib/i18n';
import { useThemeColors } from '@/theme';

export default function ThemeScreen() {
  const router = useRouter();
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const { track } = useAnalytics();
  const c = useThemeColors();
  const { locale, t: translate } = useI18n();
  const [selected, setSelected] = useState<ThemeId | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-6 pt-6">
        <View className="gap-2 mb-6">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            {translate('onboarding.themeEyebrow')}
          </Text>
          <Text variant="title" className="text-fg">
            {translate('onboarding.themeTitle')}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          {THEMES.map((t) => {
            const localized = getTheme(t.id, locale)!;
            const isSelected = selected === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setSelected(t.id)}
                className={`flex-row items-center gap-4 rounded-2xl border px-4 py-4 ${
                  isSelected
                    ? 'bg-bg-elevated border-brand'
                    : 'bg-bg-elevated border-border'
                }`}
                style={{ borderCurve: 'continuous' }}>
                <View
                  className="size-11 rounded-full items-center justify-center"
                  style={{ backgroundColor: c.bg.sunken }}>
                  <SymbolView
                    name={t.symbol as any}
                    size={20}
                    tintColor={isSelected ? c.brand.primary : c.text.secondary}
                  />
                </View>
                <View className="flex-1">
                  <Text variant="subtitle" className="text-fg">
                    {localized.label}
                  </Text>
                  <Text variant="bodySmall" className="text-fg-secondary">
                    {localized.description}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="pb-4">
          <Button
            label={translate('common.continue')}
            disabled={!selected}
            onPress={() => {
              if (!selected) return;
              track(AnalyticsEvents.PLAN_THEME_SELECTED, {
                theme_id: selected,
                flow: normalizeAnalyticsFlow(flow),
              });
              router.push({
                pathname: '/(onboarding)/duration',
                params: { theme: selected, flow },
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
