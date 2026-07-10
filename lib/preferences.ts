import {
  createMMKV,
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';
import { Appearance } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

export const storage = createMMKV({ id: 'logos.prefs' });

export const PREF_KEYS = {
  hasOnboarded: 'hasOnboarded',
  activePlanId: 'activePlanId',
  lastTranslation: 'lastTranslation',
  locale: 'locale',
  remoteProcessingAcknowledged: 'remoteProcessingAcknowledged',
  reviewAttemptedVersion: 'reviewAttemptedVersion',
  themePreference: 'themePreference',
  widgetEducationShown: 'widgetEducationShown',
} as const;

export function useHasOnboarded() {
  return useMMKVBoolean(PREF_KEYS.hasOnboarded, storage);
}

export function useActivePlanId() {
  return useMMKVNumber(PREF_KEYS.activePlanId, storage);
}

export function useLastTranslation() {
  return useMMKVString(PREF_KEYS.lastTranslation, storage);
}

export function useStoredLocale() {
  return useMMKVString(PREF_KEYS.locale, storage)[0];
}

export const prefs = {
  setOnboarded(v: boolean) {
    storage.set(PREF_KEYS.hasOnboarded, v);
  },
  getOnboarded() {
    return storage.getBoolean(PREF_KEYS.hasOnboarded) ?? false;
  },
  setActivePlanId(id: number) {
    storage.set(PREF_KEYS.activePlanId, id);
  },
  getActivePlanId() {
    return storage.getNumber(PREF_KEYS.activePlanId);
  },
  getThemePreference(): ThemePreference {
    const value = storage.getString(PREF_KEYS.themePreference);
    return value === 'light' || value === 'dark' ? value : 'system';
  },
  setThemePreference(value: ThemePreference) {
    storage.set(PREF_KEYS.themePreference, value);
    Appearance.setColorScheme(value === 'system' ? null : value);
  },
  clear() {
    storage.clearAll();
    Appearance.setColorScheme(null);
  },
};

export function applyStoredThemePreference() {
  const preference = prefs.getThemePreference();
  Appearance.setColorScheme(preference === 'system' ? null : preference);
}
