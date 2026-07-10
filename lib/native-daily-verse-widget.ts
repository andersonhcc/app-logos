import { setWidgetData } from '@bittingz/expo-widgets';
import { Platform } from 'react-native';

export async function saveDailyVerseWidgetSnapshot(snapshot: string) {
  if (Platform.OS !== 'ios') return false;
  setWidgetData(snapshot);
  return true;
}
