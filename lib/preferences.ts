import {
  createMMKV,
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from 'react-native-mmkv';

export const storage = createMMKV({ id: 'logos.prefs' });

export const PREF_KEYS = {
  hasOnboarded: 'hasOnboarded',
  activePlanId: 'activePlanId',
  lastTranslation: 'lastTranslation',
  locale: 'locale',
  remoteProcessingAcknowledged: 'remoteProcessingAcknowledged',
  reviewAttemptedVersion: 'reviewAttemptedVersion',
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
  clear() {
    storage.clearAll();
  },
};
