// Pure JS palette used by tailwind.config.js (cannot import TS).
// Keep in sync with theme/colors.ts.
const palette = {
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
  wine: { 500: '#7A2E2E', 600: '#5C2020' },
  sage: { 500: '#4A6B3A' },
};

module.exports = { palette };
