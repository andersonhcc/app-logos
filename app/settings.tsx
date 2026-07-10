import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useAnalytics } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics-events';
import { SupportedLocale, useI18n } from '@/lib/i18n';
import { notifications } from '@/lib/notifications';
import { LINK_PRIVACY_POLICY, LINK_SUPPORT } from '@/lib/links';
import type { ReminderState } from '@/lib/notifications';
import { prefs, type ThemePreference } from '@/lib/preferences';
import { syncDailyVerseWidget } from '@/lib/daily-verse-widget';

const LOCALES: SupportedLocale[] = ['pt-BR', 'en'];
const THEME_PREFERENCES: ThemePreference[] = ['system', 'light', 'dark'];

export default function SettingsScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { registerSuperProperties, track } = useAnalytics();
  const { locale, setLocale, t } = useI18n();
  const [reminder, setReminder] = useState<ReminderState>(() => notifications.getState());
  const [showIosPicker, setShowIosPicker] = useState(false);
  const [draftTime, setDraftTime] = useState(() => timeToDate(reminder.hour, reminder.minute));
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => prefs.getThemePreference());

  const updateTime = async (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (reminder.enabled) await notifications.schedule(hour, minute);
    else notifications.setTime(hour, minute);
    setReminder(notifications.getState());
    track(AnalyticsEvents.REMINDER_TIME_CHANGED, { hour, minute });
  };

  const openTimePicker = () => {
    const value = timeToDate(reminder.hour, reminder.minute);
    setDraftTime(value);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'time',
        is24Hour: true,
        onChange: (event, selected) => {
          if (event.type === 'set' && selected) void updateTime(selected);
        },
      });
    } else {
      setShowIosPicker(true);
    }
  };

  const enableReminder = async () => {
    track(AnalyticsEvents.NOTIFICATION_PERMISSION_REQUESTED, { source: 'settings' });
    let result: Awaited<ReturnType<typeof notifications.request>>;
    try {
      result = await notifications.request();
    } catch {
      result = 'unavailable';
    }
    track(AnalyticsEvents.NOTIFICATION_PERMISSION_RESULT, { result, source: 'settings' });
    if (result === 'granted') {
      await notifications.schedule(reminder.hour, reminder.minute);
      setReminder(notifications.getState());
      track(AnalyticsEvents.REMINDER_ENABLED, {
        hour: reminder.hour,
        minute: reminder.minute,
      });
      return;
    }
    Alert.alert(t('notification.permissionTitle'), t(`notification.permission.${result}`), [
      { text: t('common.cancel'), style: 'cancel' },
      ...(result === 'blocked'
        ? [{
            text: t('notification.openSettings'),
            onPress: () => {
              track(AnalyticsEvents.EXTERNAL_LINK_OPENED, { link_type: 'system_settings' });
              void Linking.openSettings();
            },
          }]
        : []),
    ]);
  };

  const disableReminder = async () => {
    await notifications.cancel();
    setReminder(notifications.getState());
    track(AnalyticsEvents.REMINDER_DISABLED);
  };

  const showWidgetInstructions = () => {
    track(AnalyticsEvents.WIDGET_INSTRUCTIONS_OPENED);
    Alert.alert(t('settings.widgetInstructionsTitle'), t('settings.widgetInstructions'));
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg-base">
      <Stack.Screen options={{ title: t('settings.title') }} />
      <ScrollView contentContainerStyle={{ gap: 32, paddingHorizontal: 24, paddingVertical: 32 }}>
        <View className="gap-2">
          <Text variant="subtitle">{t('settings.appearance')}</Text>
          <Text variant="body" className="text-fg-secondary">{t('settings.appearanceBody')}</Text>
          <View className="mt-2 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            {THEME_PREFERENCES.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  prefs.setThemePreference(item);
                  setThemePreference(item);
                  registerSuperProperties({ theme_preference: item });
                  track(AnalyticsEvents.SETTINGS_THEME_CHANGED, { theme_preference: item });
                }}
                className="flex-row items-center justify-between border-b border-border px-4 py-4 last:border-b-0">
                <Text variant="body">{t(`settings.theme.${item}`)}</Text>
                {themePreference === item && <Text variant="body" className="text-brand">✓</Text>}
              </Pressable>
            ))}
          </View>
        </View>
        <View className="gap-2">
          <Text variant="subtitle">{t('settings.reminder')}</Text>
          <Text variant="body" className="text-fg-secondary">
            {reminder.enabled ? t('settings.reminderEnabled') : t('settings.reminderDisabled')}
          </Text>
          <View className="mt-2 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            <Pressable onPress={openTimePicker} className="flex-row items-center justify-between border-b border-border px-4 py-4">
              <Text variant="body">{t('settings.reminderTime')}</Text>
              <Text variant="body" className="text-brand">{formatTime(reminder.hour, reminder.minute)}</Text>
            </Pressable>
            <Pressable
              onPress={() => void (reminder.enabled ? disableReminder() : enableReminder())}
              className="px-4 py-4">
              <Text variant="body" className="text-brand">
                {reminder.enabled ? t('settings.disableReminder') : t('settings.enableReminder')}
              </Text>
            </Pressable>
          </View>
          {showIosPicker && Platform.OS === 'ios' && (
            <View className="rounded-2xl border border-border bg-bg-elevated p-4 gap-3">
              <DateTimePicker
                value={draftTime}
                mode="time"
                display="spinner"
                onChange={(_, selected) => selected && setDraftTime(selected)}
              />
              <View className="flex-row justify-end gap-5 px-2">
                <Pressable onPress={() => setShowIosPicker(false)}>
                  <Text variant="body" className="text-fg-secondary">{t('common.cancel')}</Text>
                </Pressable>
                <Pressable onPress={() => { setShowIosPicker(false); void updateTime(draftTime); }}>
                  <Text variant="body" className="text-brand">{t('common.save')}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
        <View className="gap-2">
          <Text variant="subtitle">{t('settings.language')}</Text>
          <Text variant="body" className="text-fg-secondary">{t('settings.languageBody')}</Text>
          <View className="mt-2 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            {LOCALES.map((item) => (
              <Pressable key={item} onPress={() => {
                setLocale(item);
                registerSuperProperties({ locale: item });
                track(AnalyticsEvents.SETTINGS_LANGUAGE_CHANGED, { locale: item });
                void notifications.reschedule();
                void syncDailyVerseWidget(db);
              }} className="flex-row items-center justify-between border-b border-border px-4 py-4 last:border-b-0">
                <Text variant="body">{item === 'en' ? t('settings.english') : t('settings.portuguese')}</Text>
                {locale === item && <Text variant="body" className="text-brand">✓</Text>}
              </Pressable>
            ))}
          </View>
        </View>
        <Pressable onPress={showWidgetInstructions} className="gap-1">
          <Text variant="body" className="text-brand">{t('settings.widget')}</Text>
          <Text variant="bodySmall" className="text-fg-secondary">{t('settings.widgetBody')}</Text>
        </Pressable>
        <Pressable onPress={() => {
          track(AnalyticsEvents.PRIVACY_OPENED, { source: 'settings' });
          router.push('/privacy');
        }}>
          <Text variant="body" className="text-brand">{t('settings.privacy')}</Text>
        </Pressable>
        {!!LINK_PRIVACY_POLICY && <Pressable accessibilityRole="link" onPress={() => {
          track(AnalyticsEvents.EXTERNAL_LINK_OPENED, { link_type: 'privacy_policy' });
          void Linking.openURL(LINK_PRIVACY_POLICY);
        }}>
          <Text variant="body" className="text-brand">{locale === 'en' ? 'Privacy policy website' : 'Política de privacidade na web'}</Text>
        </Pressable>}
        {!!LINK_SUPPORT && <Pressable accessibilityRole="link" onPress={() => {
          track(AnalyticsEvents.EXTERNAL_LINK_OPENED, { link_type: 'support' });
          void Linking.openURL(LINK_SUPPORT);
        }}>
          <Text variant="body" className="text-brand">{locale === 'en' ? 'Support' : 'Suporte'}</Text>
        </Pressable>}
      </ScrollView>
    </SafeAreaView>
  );
}

function timeToDate(hour: number, minute: number) {
  const value = new Date();
  value.setHours(hour, minute, 0, 0);
  return value;
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
