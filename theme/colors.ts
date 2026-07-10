export const palette = {
  cream: {
    50: '#FDFBF6',
    100: '#FAF6EE',
    200: '#F3ECDD',
    300: '#EDE3CF',
    400: '#D8CCB4',
  },
  ink: {
    50: '#F0E8D8',
    100: '#A89B82',
    200: '#8A7F70',
    300: '#5A5046',
    400: '#3D3833',
    500: '#1F1A14',
    900: '#13110D',
    950: '#0B0907',
  },
  navy: {
    400: '#7FA0D4',
    500: '#3C5A8A',
    600: '#1C2D4A',
    700: '#0F2746',
  },
  gold: {
    400: '#D4A857',
    500: '#B8923D',
    600: '#8E6F2C',
  },
  wine: {
    500: '#7A2E2E',
    600: '#5C2020',
  },
  sage: {
    500: '#4A6B3A',
  },
  danger: {
    500: '#8B2E1E',
  },
} as const;

export const colors = {
  light: {
    bg: {
      base: palette.cream[100],
      elevated: palette.cream[200],
      sunken: palette.cream[300],
    },
    text: {
      primary: palette.ink[500],
      secondary: palette.ink[300],
      tertiary: palette.ink[200],
      inverse: palette.cream[50],
    },
    brand: {
      primary: palette.navy[600],
      accent: palette.gold[500],
    },
    accent: {
      wine: palette.wine[500],
      sage: palette.sage[500],
    },
    border: {
      DEFAULT: palette.cream[400],
      strong: palette.ink[200],
    },
    state: {
      success: palette.sage[500],
      danger: palette.danger[500],
    },
  },
  dark: {
    bg: {
      base: palette.ink[900],
      elevated: '#252119',
      sunken: palette.ink[950],
    },
    text: {
      primary: palette.ink[50],
      secondary: palette.ink[100],
      tertiary: palette.ink[200],
      inverse: palette.ink[500],
    },
    brand: {
      primary: palette.navy[400],
      accent: palette.gold[400],
    },
    accent: {
      wine: palette.wine[500],
      sage: palette.sage[500],
    },
    border: {
      DEFAULT: '#2E2920',
      strong: palette.ink[300],
    },
    state: {
      success: palette.sage[500],
      danger: palette.danger[500],
    },
  },
} as const;

export type ThemeMode = keyof typeof colors;
