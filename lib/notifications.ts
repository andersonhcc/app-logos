import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { storage } from './preferences';
import { translate } from './i18n';

const KEY_NOTIFICATION_ID = 'notification.id';
const KEY_NOTIFICATION_HOUR = 'notification.hour';
const KEY_NOTIFICATION_MINUTE = 'notification.minute';
const KEY_NOTIFICATION_ENABLED = 'notification.enabled';
const CHANNEL_ID = 'daily-devotional';

export type NotificationPermissionResult = 'granted' | 'denied' | 'blocked' | 'unavailable';
export type ReminderState = { enabled: boolean; hour: number; minute: number };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: translate('notification.channel'),
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function requestPermission(): Promise<NotificationPermissionResult> {
  if (!Device.isDevice) return 'unavailable';
  await ensureAndroidChannel();
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return 'granted';
  if (!settings.canAskAgain) return 'blocked';
  const req = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });
  if (req.granted) return 'granted';
  return req.canAskAgain ? 'denied' : 'blocked';
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  await cancelScheduledReminder();
  await ensureAndroidChannel();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: translate('notification.title'),
      body: translate('notification.body'),
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
    },
  });

  storage.set(KEY_NOTIFICATION_ID, id);
  storage.set(KEY_NOTIFICATION_HOUR, hour);
  storage.set(KEY_NOTIFICATION_MINUTE, minute);
  storage.set(KEY_NOTIFICATION_ENABLED, true);
}

async function cancelScheduledReminder() {
  const id = storage.getString(KEY_NOTIFICATION_ID);
  if (id) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // already gone
    }
    storage.remove(KEY_NOTIFICATION_ID);
  }
}

export async function cancelDailyReminder() {
  await cancelScheduledReminder();
  storage.set(KEY_NOTIFICATION_ENABLED, false);
}

export function setPreferredTime(hour: number, minute: number) {
  storage.set(KEY_NOTIFICATION_HOUR, hour);
  storage.set(KEY_NOTIFICATION_MINUTE, minute);
}

export function getScheduledTime(): { hour: number; minute: number } | null {
  const hour = storage.getNumber(KEY_NOTIFICATION_HOUR);
  const minute = storage.getNumber(KEY_NOTIFICATION_MINUTE);
  if (hour === undefined || minute === undefined) return null;
  return { hour, minute };
}

export async function rescheduleDailyReminder() {
  const state = getReminderState();
  if (state.enabled) await scheduleDailyReminder(state.hour, state.minute);
}

export function getReminderState(): ReminderState {
  const time = getScheduledTime() ?? { hour: 8, minute: 0 };
  const storedEnabled = storage.getBoolean(KEY_NOTIFICATION_ENABLED);
  const enabled = storedEnabled ?? Boolean(storage.getString(KEY_NOTIFICATION_ID));
  return { enabled, ...time };
}

export const notifications = {
  request: requestPermission,
  schedule: scheduleDailyReminder,
  cancel: cancelDailyReminder,
  getTime: getScheduledTime,
  getState: getReminderState,
  setTime: setPreferredTime,
  reschedule: rescheduleDailyReminder,
};
