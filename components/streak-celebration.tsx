import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Modal, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/lib/i18n';
import { WEEK_DAY_LETTERS, type StreakCelebration } from '@/lib/streak';
import { useThemeColors } from '@/theme';

const MILESTONES = [30, 14, 7, 3] as const;

type Props = {
  celebration: StreakCelebration;
  onClose: () => void;
};

export function StreakCelebrationModal({ celebration, onClose }: Props) {
  const c = useThemeColors();
  const { locale, t } = useI18n();
  const { streak, week, todayIndex } = celebration;

  const glow = useSharedValue(0);
  const wobble = useSharedValue(0);

  useEffect(() => {
    if (process.env.EXPO_OS === 'ios') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    glow.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
      -1,
      false
    );
    wobble.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(-1, { duration: 180 }),
          withTiming(1, { duration: 180 })
        ),
        6,
        true
      )
    );
  }, [glow, wobble]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + glow.value * 0.6 }],
    opacity: 0.35 * (1 - glow.value),
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wobble.value * 6}deg` }],
  }));

  const milestone = MILESTONES.find((value) => value === streak);

  return (
    <Modal transparent statusBarTranslucent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60 px-8">
        <Animated.View
          entering={FadeIn.duration(200)}
          className="w-full items-center rounded-3xl bg-bg-base px-6 py-10"
          style={{ borderCurve: 'continuous' }}>
          <View className="items-center justify-center" style={{ width: 150, height: 150 }}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: c.brand.accent,
                },
                glowStyle,
              ]}
            />
            <Animated.View entering={ZoomIn.springify().damping(9)} style={flameStyle}>
              <Text style={{ fontSize: 80, lineHeight: 92 }}>🔥</Text>
            </Animated.View>
          </View>

          <Animated.View
            entering={ZoomIn.delay(250).springify().damping(10)}
            className="items-center">
            <Text
              className="font-serif-bold"
              style={{ fontSize: 64, lineHeight: 72, color: c.brand.accent }}>
              {streak}
            </Text>
            <Text variant="subtitle" className="text-fg">
              {streak === 1 ? t('streak.dayLabel') : t('streak.daysLabel')}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)} className="mt-8 flex-row gap-3">
            {week.map((completed, index) => (
              <View key={index} className="items-center gap-1.5">
                <Text variant="caption" className="text-fg-tertiary">
                  {WEEK_DAY_LETTERS[locale][index]}
                </Text>
                <Animated.View
                  entering={
                    index === todayIndex
                      ? ZoomIn.delay(700).springify().damping(8)
                      : FadeIn.delay(550)
                  }
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: completed ? c.brand.accent : c.bg.sunken,
                    borderWidth: completed ? 0 : 1,
                    borderColor: c.border.DEFAULT,
                  }}>
                  {completed && (
                    <Text style={{ fontSize: 14, color: c.text.inverse }}>✓</Text>
                  )}
                </Animated.View>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800)} className="mt-8 w-full gap-6">
            <Text variant="body" className="text-fg-secondary text-center">
              {milestone ? t(`streak.milestone${milestone}`) : t('streak.keepGoing')}
            </Text>
            <Button label={t('common.continue')} onPress={onClose} />
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}
