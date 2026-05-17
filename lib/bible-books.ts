export type Testament = 'AT' | 'NT';

export type BookDef = {
  id: number;
  slug: string;
  abbrev: string;
  name: string;
  testament: Testament;
};

export const BOOKS: BookDef[] = [
  { id: 1, slug: 'genesis', abbrev: 'gn', name: 'Gênesis', testament: 'AT' },
  { id: 2, slug: 'exodo', abbrev: 'ex', name: 'Êxodo', testament: 'AT' },
  { id: 3, slug: 'levitico', abbrev: 'lv', name: 'Levítico', testament: 'AT' },
  { id: 4, slug: 'numeros', abbrev: 'nm', name: 'Números', testament: 'AT' },
  { id: 5, slug: 'deuteronomio', abbrev: 'dt', name: 'Deuteronômio', testament: 'AT' },
  { id: 6, slug: 'josue', abbrev: 'js', name: 'Josué', testament: 'AT' },
  { id: 7, slug: 'juizes', abbrev: 'jz', name: 'Juízes', testament: 'AT' },
  { id: 8, slug: 'rute', abbrev: 'rt', name: 'Rute', testament: 'AT' },
  { id: 9, slug: '1samuel', abbrev: '1sm', name: '1 Samuel', testament: 'AT' },
  { id: 10, slug: '2samuel', abbrev: '2sm', name: '2 Samuel', testament: 'AT' },
  { id: 11, slug: '1reis', abbrev: '1rs', name: '1 Reis', testament: 'AT' },
  { id: 12, slug: '2reis', abbrev: '2rs', name: '2 Reis', testament: 'AT' },
  { id: 13, slug: '1cronicas', abbrev: '1cr', name: '1 Crônicas', testament: 'AT' },
  { id: 14, slug: '2cronicas', abbrev: '2cr', name: '2 Crônicas', testament: 'AT' },
  { id: 15, slug: 'esdras', abbrev: 'ed', name: 'Esdras', testament: 'AT' },
  { id: 16, slug: 'neemias', abbrev: 'ne', name: 'Neemias', testament: 'AT' },
  { id: 17, slug: 'ester', abbrev: 'et', name: 'Ester', testament: 'AT' },
  { id: 18, slug: 'jo-livro', abbrev: 'jó', name: 'Jó', testament: 'AT' },
  { id: 19, slug: 'salmos', abbrev: 'sl', name: 'Salmos', testament: 'AT' },
  { id: 20, slug: 'proverbios', abbrev: 'pv', name: 'Provérbios', testament: 'AT' },
  { id: 21, slug: 'eclesiastes', abbrev: 'ec', name: 'Eclesiastes', testament: 'AT' },
  { id: 22, slug: 'cantares', abbrev: 'ct', name: 'Cânticos', testament: 'AT' },
  { id: 23, slug: 'isaias', abbrev: 'is', name: 'Isaías', testament: 'AT' },
  { id: 24, slug: 'jeremias', abbrev: 'jr', name: 'Jeremias', testament: 'AT' },
  { id: 25, slug: 'lamentacoes', abbrev: 'lm', name: 'Lamentações', testament: 'AT' },
  { id: 26, slug: 'ezequiel', abbrev: 'ez', name: 'Ezequiel', testament: 'AT' },
  { id: 27, slug: 'daniel', abbrev: 'dn', name: 'Daniel', testament: 'AT' },
  { id: 28, slug: 'oseias', abbrev: 'os', name: 'Oséias', testament: 'AT' },
  { id: 29, slug: 'joel', abbrev: 'jl', name: 'Joel', testament: 'AT' },
  { id: 30, slug: 'amos', abbrev: 'am', name: 'Amós', testament: 'AT' },
  { id: 31, slug: 'obadias', abbrev: 'ob', name: 'Obadias', testament: 'AT' },
  { id: 32, slug: 'jonas', abbrev: 'jn', name: 'Jonas', testament: 'AT' },
  { id: 33, slug: 'miqueias', abbrev: 'mq', name: 'Miquéias', testament: 'AT' },
  { id: 34, slug: 'naum', abbrev: 'na', name: 'Naum', testament: 'AT' },
  { id: 35, slug: 'habacuque', abbrev: 'hc', name: 'Habacuque', testament: 'AT' },
  { id: 36, slug: 'sofonias', abbrev: 'sf', name: 'Sofonias', testament: 'AT' },
  { id: 37, slug: 'ageu', abbrev: 'ag', name: 'Ageu', testament: 'AT' },
  { id: 38, slug: 'zacarias', abbrev: 'zc', name: 'Zacarias', testament: 'AT' },
  { id: 39, slug: 'malaquias', abbrev: 'ml', name: 'Malaquias', testament: 'AT' },
  { id: 40, slug: 'mateus', abbrev: 'mt', name: 'Mateus', testament: 'NT' },
  { id: 41, slug: 'marcos', abbrev: 'mc', name: 'Marcos', testament: 'NT' },
  { id: 42, slug: 'lucas', abbrev: 'lc', name: 'Lucas', testament: 'NT' },
  { id: 43, slug: 'joao', abbrev: 'jo', name: 'João', testament: 'NT' },
  { id: 44, slug: 'atos', abbrev: 'atos', name: 'Atos', testament: 'NT' },
  { id: 45, slug: 'romanos', abbrev: 'rm', name: 'Romanos', testament: 'NT' },
  { id: 46, slug: '1corintios', abbrev: '1co', name: '1 Coríntios', testament: 'NT' },
  { id: 47, slug: '2corintios', abbrev: '2co', name: '2 Coríntios', testament: 'NT' },
  { id: 48, slug: 'galatas', abbrev: 'gl', name: 'Gálatas', testament: 'NT' },
  { id: 49, slug: 'efesios', abbrev: 'ef', name: 'Efésios', testament: 'NT' },
  { id: 50, slug: 'filipenses', abbrev: 'fp', name: 'Filipenses', testament: 'NT' },
  { id: 51, slug: 'colossenses', abbrev: 'cl', name: 'Colossenses', testament: 'NT' },
  { id: 52, slug: '1tessalonicenses', abbrev: '1ts', name: '1 Tessalonicenses', testament: 'NT' },
  { id: 53, slug: '2tessalonicenses', abbrev: '2ts', name: '2 Tessalonicenses', testament: 'NT' },
  { id: 54, slug: '1timoteo', abbrev: '1tm', name: '1 Timóteo', testament: 'NT' },
  { id: 55, slug: '2timoteo', abbrev: '2tm', name: '2 Timóteo', testament: 'NT' },
  { id: 56, slug: 'tito', abbrev: 'tt', name: 'Tito', testament: 'NT' },
  { id: 57, slug: 'filemom', abbrev: 'fm', name: 'Filemom', testament: 'NT' },
  { id: 58, slug: 'hebreus', abbrev: 'hb', name: 'Hebreus', testament: 'NT' },
  { id: 59, slug: 'tiago', abbrev: 'tg', name: 'Tiago', testament: 'NT' },
  { id: 60, slug: '1pedro', abbrev: '1pe', name: '1 Pedro', testament: 'NT' },
  { id: 61, slug: '2pedro', abbrev: '2pe', name: '2 Pedro', testament: 'NT' },
  { id: 62, slug: '1joao', abbrev: '1jo', name: '1 João', testament: 'NT' },
  { id: 63, slug: '2joao', abbrev: '2jo', name: '2 João', testament: 'NT' },
  { id: 64, slug: '3joao', abbrev: '3jo', name: '3 João', testament: 'NT' },
  { id: 65, slug: 'judas', abbrev: 'jd', name: 'Judas', testament: 'NT' },
  { id: 66, slug: 'apocalipse', abbrev: 'ap', name: 'Apocalipse', testament: 'NT' },
];

export const BOOK_BY_ABBREV: Record<string, BookDef> = Object.fromEntries(
  BOOKS.map((b) => [b.abbrev, b])
);

export const BOOK_BY_SLUG: Record<string, BookDef> = Object.fromEntries(
  BOOKS.map((b) => [b.slug, b])
);
