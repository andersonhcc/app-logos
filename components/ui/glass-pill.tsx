import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { View } from 'react-native';

import { Text } from './text';

type Props = {
  label: string;
};

export function GlassPill({ label }: Props) {
  if (!isLiquidGlassAvailable()) {
    return (
      <View className="rounded-full bg-bg-elevated/80 border border-border px-3.5 py-1.5">
        <Text variant="caption" className="text-fg font-serif-bold">
          {label}
        </Text>
      </View>
    );
  }

  return (
    <GlassView
      glassEffectStyle="regular"
      isInteractive
      style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 }}>
      <Text variant="caption" className="text-fg font-serif-bold">
        {label}
      </Text>
    </GlassView>
  );
}
