import { Stack, useRouter } from 'expo-router';
import { Linking, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { SupportedLocale, useI18n } from '@/lib/i18n';
import { notifications } from '@/lib/notifications';
import { LINK_PRIVACY_POLICY, LINK_SUPPORT } from '@/lib/links';

const LOCALES: SupportedLocale[] = ['pt-BR', 'en'];

export default function SettingsScreen() {
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-bg-base">
      <Stack.Screen options={{ title: t('settings.title') }} />
      <View className="gap-8 px-6 py-8">
        <View className="gap-2">
          <Text variant="subtitle">{t('settings.language')}</Text>
          <Text variant="body" className="text-fg-secondary">{t('settings.languageBody')}</Text>
          <View className="mt-2 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            {LOCALES.map((item) => (
              <Pressable key={item} onPress={() => { setLocale(item); void notifications.reschedule(); }} className="flex-row items-center justify-between border-b border-border px-4 py-4 last:border-b-0">
                <Text variant="body">{item === 'en' ? t('settings.english') : t('settings.portuguese')}</Text>
                {locale === item && <Text variant="body" className="text-brand">✓</Text>}
              </Pressable>
            ))}
          </View>
        </View>
        <Pressable onPress={() => router.push('/privacy')}>
          <Text variant="body" className="text-brand">{t('settings.privacy')}</Text>
        </Pressable>
        {!!LINK_PRIVACY_POLICY && <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(LINK_PRIVACY_POLICY)}>
          <Text variant="body" className="text-brand">{locale === 'en' ? 'Privacy policy website' : 'Política de privacidade na web'}</Text>
        </Pressable>}
        {!!LINK_SUPPORT && <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(LINK_SUPPORT)}>
          <Text variant="body" className="text-brand">{locale === 'en' ? 'Support' : 'Suporte'}</Text>
        </Pressable>}
      </View>
    </SafeAreaView>
  );
}
