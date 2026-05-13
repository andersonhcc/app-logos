import { Text as RNText, type TextProps } from 'react-native';

import { textStyles } from '@/theme';

type Variant = keyof typeof textStyles;

type Props = TextProps & {
  variant?: Variant;
  className?: string;
};

export function Text({ variant = 'body', style, className, ...rest }: Props) {
  return (
    <RNText
      className={`text-fg ${className ?? ''}`}
      style={[textStyles[variant], style]}
      {...rest}
    />
  );
}
