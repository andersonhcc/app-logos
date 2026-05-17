import { Share } from 'react-native';

import { formatReference, type Passage } from './bible';
import type { ThemeDef } from './themes';

const TAGLINE = 'via Logos AI';

export type ShareInput = {
  passage: Passage;
  reflection?: string | null;
  theme?: ThemeDef | null;
};

export function buildShareText({ passage, reflection, theme }: ShareInput): string {
  const reference = formatReference(passage);
  const verseText = passage.verses
    .map((v) => v.text.replace(/\s+/g, ' ').trim())
    .join(' ');

  const lines: string[] = [`"${verseText}"`, `— ${reference}`];

  if (reflection?.trim()) {
    lines.push('', reflection.trim());
  } else if (theme) {
    lines.push('', `Meditando sobre ${theme.label.toLowerCase()}.`);
  }

  lines.push('', TAGLINE);
  return lines.join('\n');
}

export async function shareReflection(input: ShareInput) {
  const message = buildShareText(input);
  await Share.share({ message });
}
