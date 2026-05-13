export { colors, palette } from './colors';
export type { ThemeMode } from './colors';
export { fontFamily, fontSize, lineHeight, textStyles } from './typography';
export { spacing, radii } from './spacing';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from './colors';

export function useThemeColors() {
  const scheme = useColorScheme();
  return colors[scheme === 'dark' ? 'dark' : 'light'];
}
