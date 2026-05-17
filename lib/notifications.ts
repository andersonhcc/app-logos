import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { prefs, storage } from './preferences';

const KEY_NOTIFICATION_ID = 'notification.id';
const KEY_NOTIFICATION_HOUR = 'notification.hour';
const KEY_NOTIFICATION_MINUTE = 'notification.minute';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermission(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });
  return req.granted;
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  await cancelDailyReminder();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-devotional', {
      name: 'Lembrete diário',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sua leitura de hoje',
      body: 'Reserve um momento com a Palavra.',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: Platform.OS === 'android' ? 'daily-devotional' : undefined,
    },
  });

  storage.set(KEY_NOTIFICATION_ID, id);
  storage.set(KEY_NOTIFICATION_HOUR, hour);
  storage.set(KEY_NOTIFICATION_MINUTE, minute);
}

export async function cancelDailyReminder() {
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

export function getScheduledTime(): { hour: number; minute: number } | null {
  const hour = storage.getNumber(KEY_NOTIFICATION_HOUR);
  const minute = storage.getNumber(KEY_NOTIFICATION_MINUTE);
  if (hour === undefined || minute === undefined) return null;
  return { hour, minute };
}

export const notifications = {
  request: requestPermission,
  schedule: scheduleDailyReminder,
  cancel: cancelDailyReminder,
  getTime: getScheduledTime,
};

// Re-export so callers don't depend on `preferences` directly here
void prefs;
