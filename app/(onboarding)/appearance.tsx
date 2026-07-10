import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Appearance, Pressable, View } from 'react-native';
import Animated, {
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAnalytics } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics-events';
import { useI18n } from '@/lib/i18n';
import { prefs, type ThemePreference } from '@/lib/preferences';
import { useThemeColors } from '@/theme';

type SelectableTheme = Exclude<ThemePreference, 'system'>;

export default function AppearanceScreen() {
  const router = useRouter();
  const { registerSuperProperties, track } = useAnalytics();
  const { t } = useI18n();
  const [systemTheme] = useState<SelectableTheme>(() =>
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
  );
  const [selected, setSelected] = useState<SelectableTheme>(systemTheme);

  const choose = (theme: SelectableTheme) => {
    setSelected(theme);
    prefs.setThemePreference(theme);
    registerSuperProperties({ theme_preference: theme });
    track(AnalyticsEvents.APPEARANCE_SELECTED, { appearance: theme });
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-6 pt-6">
        <Animated.View entering={FadeInDown.duration(350)} className="gap-2 mb-8">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            {t('onboarding.appearanceEyebrow')}
          </Text>
          <Text variant="title">{t('onboarding.appearanceTitle')}</Text>
          <Text variant="body" className="text-fg-secondary">
            {t('onboarding.appearanceBody')}
          </Text>
        </Animated.View>

        <View className="gap-4">
          <ThemeChoice
            mode="light"
            selected={selected === 'light'}
            recommended={systemTheme === 'light'}
            onPress={() => choose('light')}
          />
          <ThemeChoice
            mode="dark"
            selected={selected === 'dark'}
            recommended={systemTheme === 'dark'}
            onPress={() => choose('dark')}
          />
        </View>

        <View className="flex-1" />
        <Animated.View entering={FadeInDown.delay(180).duration(350)} className="pb-4">
          <Button
            label={t('common.continue')}
            onPress={() => {
              prefs.setThemePreference(selected);
              router.push('/(onboarding)/theme');
            }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function ThemeChoice({
  mode,
  selected,
  recommended,
  onPress,
}: {
  mode: SelectableTheme;
  selected: boolean;
  recommended: boolean;
  onPress: () => void;
}) {
  const { t } = useI18n();
  const colors = useThemeColors();
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(selected ? 1 : 0, { damping: 16, stiffness: 180 });
  }, [progress, selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.82 + progress.value * 0.18,
    transform: [{ scale: 0.98 + progress.value * 0.02 }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(mode === 'light' ? 60 : 120).duration(350)} style={animatedStyle}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        onPress={onPress}
        className={`min-h-36 rounded-2xl border p-5 justify-between bg-bg-elevated ${selected ? 'border-brand' : 'border-border'}`}
        style={{ borderCurve: 'continuous' }}>
        <View className="flex-row items-center justify-between">
          <View className="size-12 rounded-full items-center justify-center bg-bg-sunken">
            <SymbolView
              name={mode === 'light' ? 'sun.max.fill' : 'moon.stars.fill'}
              size={24}
              tintColor={selected ? colors.brand.primary : colors.text.secondary}
            />
          </View>
          {selected && (
            <Animated.View entering={ZoomIn.springify().damping(16)}>
              <Text variant="subtitle" className="text-brand">✓</Text>
            </Animated.View>
          )}
        </View>
        <View className="gap-1">
          <Text variant="title">{t(`settings.theme.${mode}`)}</Text>
          {recommended && (
            <Text variant="caption" className="text-fg-tertiary">
              {t('onboarding.systemTheme')}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
