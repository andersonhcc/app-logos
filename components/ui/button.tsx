import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps } from 'react-native';

import { Text } from './text';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
};

const styles: Record<Variant, { container: string; label: string }> = {
  primary: {
    container: 'bg-brand active:opacity-90',
    label: 'text-fg-inverse',
  },
  secondary: {
    container: 'bg-bg-elevated border border-border active:bg-bg-sunken',
    label: 'text-fg',
  },
  ghost: {
    container: 'bg-transparent active:bg-bg-elevated',
    label: 'text-brand',
  },
};

export function Button({ label, variant = 'primary', onPress, disabled, ...rest }: Props) {
  return (
    <Pressable
      disabled={disabled}
      className={`h-12 px-5 rounded-xl items-center justify-center ${styles[variant].container} ${
        disabled ? 'opacity-40' : ''
      }`}
      onPress={(e) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
      }}
      {...rest}>
      <Text variant="body" className={`font-serif-bold ${styles[variant].label}`}>
        {label}
      </Text>
    </Pressable>
  );
}
