import type { SupportedLocale } from './i18n';

export type CollectionReading = { book: string; chapter: number };
export type BibleCollection = {
  id: 'morning-psalms' | 'john' | 'paul' | 'proverbs';
  title: Record<SupportedLocale, string>;
  readings: CollectionReading[];
};

const chapters = (book: string, count: number): CollectionReading[] =>
  Array.from({ length: count }, (_, index) => ({ book, chapter: index + 1 }));

export const COLLECTIONS: BibleCollection[] = [
  {
    id: 'morning-psalms',
    title: { 'pt-BR': 'Salmos para a manhã', en: 'Psalms for the morning' },
    readings: [5, 19, 23, 27, 30, 34, 46, 63, 84, 90, 91, 92, 100, 143].map((chapter) => ({ book: 'salmos', chapter })),
  },
  {
    id: 'john',
    title: { 'pt-BR': 'Evangelho de João', en: 'Gospel of John' },
    readings: chapters('joao', 21),
  },
  {
    id: 'paul',
    title: { 'pt-BR': 'Cartas de Paulo', en: "Paul's letters" },
    readings: [
      ['romanos', 8], ['1corintios', 13], ['2corintios', 5], ['galatas', 5],
      ['efesios', 2], ['filipenses', 4], ['colossenses', 3], ['1tessalonicenses', 5],
      ['2tessalonicenses', 3], ['1timoteo', 6], ['2timoteo', 3], ['tito', 3], ['filemom', 1],
    ].map(([book, chapter]) => ({ book: String(book), chapter: Number(chapter) })),
  },
  {
    id: 'proverbs',
    title: { 'pt-BR': 'Provérbios diários', en: 'Daily Proverbs' },
    readings: chapters('proverbios', 31),
  },
];

export function getCollection(id: string) {
  return COLLECTIONS.find((collection) => collection.id === id);
}
