const { palette } = require('./theme/tw-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: palette.cream,
        ink: palette.ink,
        navy: palette.navy,
        gold: palette.gold,
        wine: palette.wine,
        sage: palette.sage,
        bg: {
          base: 'rgb(var(--bg-base) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          sunken: 'rgb(var(--bg-sunken) / <alpha-value>)',
        },
        fg: {
          DEFAULT: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand-primary) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['EBGaramond_500Medium'],
        'serif-bold': ['EBGaramond_700Bold'],
        'serif-italic': ['EBGaramond_500Medium_Italic'],
        citation: ['CrimsonPro_500Medium_Italic'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
    },
  },
  plugins: [],
};
