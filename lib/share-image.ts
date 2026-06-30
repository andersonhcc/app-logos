import * as Sharing from 'expo-sharing';
import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { translate } from './i18n';

export async function shareCardImage(ref: RefObject<View | null>) {
  if (!ref.current) throw new Error('Share card not mounted');

  const uri = await captureRef(ref, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
    // Capture at 2x for retina-quality 1080×1920 output
    width: 1080,
    height: 1920,
  });

  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error(translate('share.unavailable'));
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: translate('share.dialog'),
    UTI: 'public.png',
  });
}
