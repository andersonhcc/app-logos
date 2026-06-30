import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useI18n } from '@/lib/i18n';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 justify-between px-6 py-12">
        <View className="flex-1 justify-center gap-4">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            Logos AI
          </Text>
          <Text variant="hero" className="text-fg">
            {t('onboarding.tagline')}
          </Text>
          <Text variant="body" className="text-fg-secondary">
            {t('onboarding.intro')}
          </Text>
        </View>
        <Button label={t('onboarding.start')} onPress={() => router.push('/(onboarding)/theme')} />
      </View>
    </SafeAreaView>
  );
}
