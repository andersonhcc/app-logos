import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as StoreReview from 'expo-store-review';
import { Platform } from 'react-native';

import { PREF_KEYS, storage } from './preferences';

const REVIEW_DELAY_MS = 2_000;

export async function requestReviewAfterCompletedReading() {
  const version = Application.nativeApplicationVersion;
  const configuredAsTestFlight = Constants.expoConfig?.extra?.isTestFlight === true;

  if (__DEV__ || Platform.OS === 'web' || configuredAsTestFlight || !version) return;
  if (storage.getString(PREF_KEYS.reviewAttemptedVersion) === version) return;

  storage.set(PREF_KEYS.reviewAttemptedVersion, version);
  await new Promise((resolve) => setTimeout(resolve, REVIEW_DELAY_MS));

  if (await StoreReview.isAvailableAsync()) {
    await StoreReview.requestReview();
  }
}
