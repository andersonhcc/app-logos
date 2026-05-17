import type { ThemeId } from './themes';

export type PassageRef = {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
};

// Fallback rotation per theme until AI plan generation (Fatia 3) is ready.
// Each entry is one day's reading. We rotate modulo array length for longer plans.
export const CURATED_PASSAGES: Record<ThemeId, PassageRef[]> = {
  ansiedade: [
    { book: 'mateus', chapter: 6, verseStart: 25, verseEnd: 34 },
    { book: 'filipenses', chapter: 4, verseStart: 6, verseEnd: 7 },
    { book: '1pedro', chapter: 5, verseStart: 6, verseEnd: 7 },
    { book: 'salmos', chapter: 23, verseStart: 1, verseEnd: 6 },
    { book: 'joao', chapter: 14, verseStart: 27, verseEnd: 27 },
    { book: 'isaias', chapter: 41, verseStart: 10, verseEnd: 10 },
    { book: 'salmos', chapter: 46, verseStart: 1, verseEnd: 3 },
  ],
  gratidao: [
    { book: '1tessalonicenses', chapter: 5, verseStart: 16, verseEnd: 18 },
    { book: 'salmos', chapter: 100, verseStart: 1, verseEnd: 5 },
    { book: 'colossenses', chapter: 3, verseStart: 15, verseEnd: 17 },
    { book: 'salmos', chapter: 136, verseStart: 1, verseEnd: 9 },
    { book: 'efesios', chapter: 5, verseStart: 19, verseEnd: 20 },
    { book: 'tiago', chapter: 1, verseStart: 17, verseEnd: 17 },
    { book: 'salmos', chapter: 103, verseStart: 1, verseEnd: 5 },
  ],
  perdao: [
    { book: 'mateus', chapter: 6, verseStart: 14, verseEnd: 15 },
    { book: 'efesios', chapter: 4, verseStart: 31, verseEnd: 32 },
    { book: 'colossenses', chapter: 3, verseStart: 12, verseEnd: 14 },
    { book: 'mateus', chapter: 18, verseStart: 21, verseEnd: 22 },
    { book: '1joao', chapter: 1, verseStart: 8, verseEnd: 9 },
    { book: 'salmos', chapter: 32, verseStart: 1, verseEnd: 5 },
    { book: 'lucas', chapter: 6, verseStart: 36, verseEnd: 37 },
  ],
  fe: [
    { book: 'hebreus', chapter: 11, verseStart: 1, verseEnd: 6 },
    { book: 'romanos', chapter: 10, verseStart: 17, verseEnd: 17 },
    { book: 'tiago', chapter: 2, verseStart: 14, verseEnd: 18 },
    { book: 'marcos', chapter: 11, verseStart: 22, verseEnd: 24 },
    { book: 'mateus', chapter: 17, verseStart: 20, verseEnd: 20 },
    { book: '2corintios', chapter: 5, verseStart: 7, verseEnd: 7 },
    { book: 'efesios', chapter: 2, verseStart: 8, verseEnd: 9 },
  ],
  proposito: [
    { book: 'jeremias', chapter: 29, verseStart: 11, verseEnd: 13 },
    { book: 'romanos', chapter: 8, verseStart: 28, verseEnd: 30 },
    { book: 'efesios', chapter: 2, verseStart: 10, verseEnd: 10 },
    { book: 'proverbios', chapter: 3, verseStart: 5, verseEnd: 6 },
    { book: 'colossenses', chapter: 3, verseStart: 23, verseEnd: 24 },
    { book: 'salmos', chapter: 139, verseStart: 13, verseEnd: 16 },
    { book: 'eclesiastes', chapter: 3, verseStart: 1, verseEnd: 8 },
  ],
  relacionamentos: [
    { book: '1corintios', chapter: 13, verseStart: 4, verseEnd: 8 },
    { book: 'joao', chapter: 13, verseStart: 34, verseEnd: 35 },
    { book: 'efesios', chapter: 4, verseStart: 2, verseEnd: 3 },
    { book: 'romanos', chapter: 12, verseStart: 9, verseEnd: 18 },
    { book: 'colossenses', chapter: 3, verseStart: 12, verseEnd: 14 },
    { book: 'proverbios', chapter: 17, verseStart: 17, verseEnd: 17 },
    { book: '1joao', chapter: 4, verseStart: 7, verseEnd: 12 },
  ],
  esperanca: [
    { book: 'romanos', chapter: 15, verseStart: 13, verseEnd: 13 },
    { book: 'lamentacoes', chapter: 3, verseStart: 22, verseEnd: 26 },
    { book: 'hebreus', chapter: 6, verseStart: 17, verseEnd: 19 },
    { book: 'romanos', chapter: 8, verseStart: 24, verseEnd: 25 },
    { book: 'salmos', chapter: 42, verseStart: 5, verseEnd: 11 },
    { book: 'isaias', chapter: 40, verseStart: 28, verseEnd: 31 },
    { book: '1pedro', chapter: 1, verseStart: 3, verseEnd: 5 },
  ],
  paz: [
    { book: 'joao', chapter: 14, verseStart: 27, verseEnd: 27 },
    { book: 'filipenses', chapter: 4, verseStart: 6, verseEnd: 9 },
    { book: 'salmos', chapter: 4, verseStart: 6, verseEnd: 8 },
    { book: 'isaias', chapter: 26, verseStart: 3, verseEnd: 4 },
    { book: 'colossenses', chapter: 3, verseStart: 15, verseEnd: 15 },
    { book: 'romanos', chapter: 5, verseStart: 1, verseEnd: 5 },
    { book: 'mateus', chapter: 11, verseStart: 28, verseEnd: 30 },
  ],
};

export function passageForDay(theme: ThemeId, day: number): PassageRef {
  const list = CURATED_PASSAGES[theme];
  return list[(day - 1) % list.length];
}
