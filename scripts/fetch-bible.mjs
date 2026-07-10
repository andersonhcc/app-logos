#!/usr/bin/env node
// Fetches two public-domain translations from midvash/bible-data.
// Sources and licenses are documented in assets/bible/LICENSES.md.

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = 'https://raw.githubusercontent.com/midvash/bible-data/main/versions';
const versions = [
  { locale: 'pt-BR', directory: `${root}/pt/almeida-livre`, file: 'almeida-livre.json' },
  { locale: 'en', directory: `${root}/en/web`, file: 'web.json' },
];
const abbrevs = ['gn','ex','lv','nm','dt','js','jz','rt','1sm','2sm','1rs','2rs','1cr','2cr','ed','ne','et','jó','sl','pv','ec','ct','is','jr','lm','ez','dn','os','jl','am','ob','jn','mq','na','hc','sf','ag','zc','ml','mt','mc','lc','jo','atos','rm','1co','2co','gl','ef','fp','cl','1ts','2ts','1tm','2tm','tt','fm','hb','tg','1pe','2pe','1jo','2jo','3jo','jd','ap'];
const outDir = resolve(process.cwd(), 'assets', 'bible');
mkdirSync(outDir, { recursive: true });

for (const version of versions) {
  const url = `${version.directory}/${version.file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const source = await response.json();
  if (!Array.isArray(source.books) || source.books.length !== 66) throw new Error(`${version.locale}: expected 66 books`);
  const data = source.books.map((book, index) => ({
    abbrev: abbrevs[index],
    name: book.name ?? book.book,
    chapters: book.chapters.map((chapter) => chapter.verses.map((verse) => verse.text)),
  }));
  writeFileSync(resolve(outDir, `${version.locale}.json`), JSON.stringify(data));
  const metadataResponse = await fetch(`${version.directory}/metadata.json`);
  if (!metadataResponse.ok) throw new Error(`${version.locale}: metadata HTTP ${metadataResponse.status}`);
  writeFileSync(resolve(outDir, `${version.locale}.metadata.json`), JSON.stringify(await metadataResponse.json(), null, 2));
  console.log(`Wrote ${version.locale}.json`);
}
