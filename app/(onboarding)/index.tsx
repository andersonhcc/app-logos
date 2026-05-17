import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 justify-between px-6 py-12">
        <View className="flex-1 justify-center gap-4">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            Logos AI
          </Text>
          <Text variant="hero" className="text-fg">
            Um caminho diário pela Palavra.
          </Text>
          <Text variant="body" className="text-fg-secondary">
            Escolha um tema do seu coração e receba um plano de leitura com versículos,
            reflexão e oração — feito pra você.
          </Text>
        </View>
        <Button label="Começar" onPress={() => router.push('/(onboarding)/theme')} />
      </View>
    </SafeAreaView>
  );
}
