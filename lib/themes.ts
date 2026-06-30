import type { SupportedLocale } from './i18n';

export type ThemeId =
  | 'ansiedade'
  | 'gratidao'
  | 'perdao'
  | 'fe'
  | 'proposito'
  | 'relacionamentos'
  | 'esperanca'
  | 'paz';

export type ThemeDef = {
  id: ThemeId;
  label: string;
  description: string;
  symbol: string;
};

export const THEMES: ThemeDef[] = [
  { id: 'ansiedade', label: 'Ansiedade', description: 'Paz em meio à inquietação.', symbol: 'wind' },
  { id: 'gratidao', label: 'Gratidão', description: 'Coração que reconhece.', symbol: 'heart' },
  { id: 'perdao', label: 'Perdão', description: 'Soltar o peso.', symbol: 'leaf' },
  { id: 'fe', label: 'Fé', description: 'Confiança no invisível.', symbol: 'sparkles' },
  { id: 'proposito', label: 'Propósito', description: 'Descobrir o chamado.', symbol: 'mountain.2' },
  { id: 'relacionamentos', label: 'Relacionamentos', description: 'Amar como Cristo amou.', symbol: 'person.2' },
  { id: 'esperanca', label: 'Esperança', description: 'Luz no horizonte.', symbol: 'sunrise' },
  { id: 'paz', label: 'Paz', description: 'Quietude interior.', symbol: 'water.waves' },
];

export const DURATIONS = [7, 14, 30] as const;
export type Duration = (typeof DURATIONS)[number];

const ENGLISH: Record<ThemeId, Pick<ThemeDef, 'label' | 'description'>> = {
  ansiedade: { label: 'Anxiety', description: 'Peace in the middle of uncertainty.' }, gratidao: { label: 'Gratitude', description: 'A heart that recognizes.' },
  perdao: { label: 'Forgiveness', description: 'Release the weight.' }, fe: { label: 'Faith', description: 'Trust in the unseen.' },
  proposito: { label: 'Purpose', description: 'Discover your calling.' }, relacionamentos: { label: 'Relationships', description: 'Love as Christ loved.' },
  esperanca: { label: 'Hope', description: 'Light on the horizon.' }, paz: { label: 'Peace', description: 'Inner stillness.' },
};

export function getTheme(id: string, locale: SupportedLocale = 'pt-BR'): ThemeDef | undefined {
  const theme = THEMES.find((t) => t.id === id);
  return theme && locale === 'en' ? { ...theme, ...ENGLISH[theme.id] } : theme;
}
