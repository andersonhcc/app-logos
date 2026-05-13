import { Platform } from 'react-native';

export const fontFamily = {
  serif: 'EBGaramond_500Medium',
  serifBold: 'EBGaramond_700Bold',
  serifItalic: 'EBGaramond_500Medium_Italic',
  citation: 'CrimsonPro_500Medium_Italic',
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  rounded: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const lineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const textStyles = {
  hero: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize['4xl'],
    lineHeight: fontSize['4xl'] * lineHeight.tight,
  },
  title: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * lineHeight.snug,
  },
  subtitle: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.snug,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  citation: {
    fontFamily: fontFamily.citation,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.relaxed,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
} as const;
