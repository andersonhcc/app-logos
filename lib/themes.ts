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

export function getTheme(id: string): ThemeDef | undefined {
  return THEMES.find((t) => t.id === id);
}
