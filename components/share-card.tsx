import { forwardRef } from 'react';
import { View } from 'react-native';

import { formatReference, type Passage } from '@/lib/bible';
import type { ThemeDef } from '@/lib/themes';
import { palette } from '@/theme';
import { useI18n } from '@/lib/i18n';

import { Text } from './ui/text';

// Stories aspect ratio (9:16) at 1080×1920. We render at half-resolution
// (540×960) and capture at 2x — keeps capture fast and memory low.
export const SHARE_CARD_WIDTH = 540;
export const SHARE_CARD_HEIGHT = 960;

type Props = {
  passage: Passage;
  reflection?: string | null;
  theme?: ThemeDef | null;
};

export const ShareCard = forwardRef<View, Props>(function ShareCard(
  { passage, reflection, theme },
  ref
) {
  const { t } = useI18n();
  const verseText = passage.verses
    .map((v) => v.text.replace(/\s+/g, ' ').trim())
    .join(' ');
  const reference = formatReference(passage);

  return (
    <View
      ref={ref}
      collapsable={false}
      style={{
        width: SHARE_CARD_WIDTH,
        height: SHARE_CARD_HEIGHT,
        backgroundColor: palette.cream[100],
        paddingHorizontal: 48,
        paddingVertical: 80,
        justifyContent: 'space-between',
      }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        {theme && (
          <Text
            variant="caption"
            style={{
              color: palette.gold[500],
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontSize: 14,
            }}>
            {theme.label}
          </Text>
        )}
        <View
          style={{
            width: 32,
            height: 2,
            backgroundColor: palette.gold[500],
            marginTop: 4,
          }}
        />
      </View>

      <View style={{ gap: 24 }}>
        <Text
          variant="hero"
          style={{
            color: palette.ink[500],
            fontSize: 30,
            lineHeight: 42,
            textAlign: 'center',
          }}>
          “{verseText}”
        </Text>
        <Text
          style={{
            color: palette.navy[600],
            fontSize: 16,
            textAlign: 'center',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
          {reference}
        </Text>
        {reflection?.trim() && (
          <Text
            variant="citation"
            style={{
              color: palette.ink[300],
              fontSize: 18,
              lineHeight: 28,
              textAlign: 'center',
              marginTop: 16,
            }}>
            {reflection.trim()}
          </Text>
        )}
      </View>

      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text
          style={{
            color: palette.ink[200],
            fontSize: 12,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}>
          Logos AI
        </Text>
        <Text style={{ color: palette.ink[100], fontSize: 11 }}>
          {t('share.devotional')}
        </Text>
      </View>
    </View>
  );
});
