import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { DB_NAME, migrate } from '@/lib/db';
import { LocaleProvider, useI18n } from '@/lib/i18n';
import { assertProductionLinks } from '@/lib/links';

import {
  EBGaramond_500Medium,
  EBGaramond_500Medium_Italic,
  EBGaramond_700Bold,
  useFonts,
} from '@expo-google-fonts/eb-garamond';
import { CrimsonPro_500Medium_Italic } from '@expo-google-fonts/crimson-pro';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme';

assertProductionLinks();


const navLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.light.bg.base,
    card: colors.light.bg.elevated,
    text: colors.light.text.primary,
    border: colors.light.border.DEFAULT,
    primary: colors.light.brand.primary,
  },
};

const navDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.dark.bg.base,
    card: colors.dark.bg.elevated,
    text: colors.dark.text.primary,
    border: colors.dark.border.DEFAULT,
    primary: colors.dark.brand.primary,
  },
};

function AppContent() {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  const [fontsLoaded] = useFonts({
    EBGaramond_500Medium,
    EBGaramond_500Medium_Italic,
    EBGaramond_700Bold,
    CrimsonPro_500Medium_Italic,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={colorScheme === 'dark' ? navDark : navLight}>
            <SQLiteProvider databaseName={DB_NAME} onInit={migrate}>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="privacy"
                  options={{
                    title: t('privacy.title'),
                    headerBackButtonDisplayMode: 'minimal',
                  }}
                />
                <Stack.Screen
                  name="settings"
                  options={{ title: t('settings.title'), headerBackButtonDisplayMode: 'minimal' }}
                />
              </Stack>
              <StatusBar style="auto" />
            </SQLiteProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return <LocaleProvider><AppContent /></LocaleProvider>;
}
