import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useGlobalSearchParams, usePathname, useSegments } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AnalyticsProvider, useAnalytics } from '@/lib/analytics';
import { type AnalyticsProperties, type AnalyticsScreenName } from '@/lib/analytics-events';
import { DB_NAME, migrate } from '@/lib/db';
import { LocaleProvider, useI18n } from '@/lib/i18n';
import { assertProductionLinks } from '@/lib/links';
import { applyStoredThemePreference, prefs, useHasOnboarded } from '@/lib/preferences';

import {
  EBGaramond_500Medium,
  EBGaramond_500Medium_Italic,
  EBGaramond_700Bold,
  useFonts,
} from '@expo-google-fonts/eb-garamond';
import { CrimsonPro_500Medium_Italic } from '@expo-google-fonts/crimson-pro';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://22760bdae3ad9ab8d481af88919dd099@o4511712543637504.ingest.us.sentry.io/4511712544489472',

  sendDefaultPii: false,

  // Enable Logs
  enableLogs: false,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

assertProductionLinks();
applyStoredThemePreference();


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

function firstParam(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function numericParam(value: unknown) {
  const raw = firstParam(value);
  const parsed = typeof raw === 'string' ? Number(raw) : typeof raw === 'number' ? raw : NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
}

function cleanGroup(segment?: string) {
  return segment?.startsWith('(') && segment.endsWith(')')
    ? segment.slice(1, -1)
    : segment;
}

function getRouteTemplate(segments: string[]) {
  if (segments[0] === '(onboarding)') {
    const route = segments.at(-1);
    return !route || route === '(onboarding)' || route === 'index'
      ? '/onboarding'
      : `/onboarding/${route}`;
  }
  if (segments[0] === '(tabs)') {
    if (segments.includes('(hoje)')) return '/today';
    if (segments.includes('collection')) return '/collection/[id]';
    if (segments.includes('passage')) return '/passage/[book]/[chapter]';
    if (segments.includes('(explorar)')) return '/explore';
  }
  const visibleSegments = segments.filter((segment) => !segment.startsWith('(') && segment !== 'index');
  return visibleSegments.length ? `/${visibleSegments.join('/')}` : '/';
}

function getScreenName(segments: string[], routeTemplate: string): AnalyticsScreenName {
  if (segments.length === 0 || segments[0] === 'index') return 'root_redirect';
  if (segments[0] === '(onboarding)') {
    const route = segments.at(-1);
    if (!route || route === 'index') return 'onboarding_welcome';
    if (route === 'appearance') return 'onboarding_appearance';
    if (route === 'theme') return 'onboarding_theme';
    if (route === 'duration') return 'onboarding_duration';
    if (route === 'notification') return 'onboarding_notification';
    if (route === 'done') return 'onboarding_done';
  }
  if (segments[0] === '(tabs)') {
    if (segments.includes('(hoje)')) return 'today';
    if (segments.includes('collection')) return 'collection_detail';
    if (segments.includes('passage')) return 'passage_detail';
    if (segments.includes('(explorar)')) return 'explore';
  }
  if (segments[0] === 'plans') {
    if (routeTemplate === '/plans') return 'plans_list';
    if (routeTemplate === '/plans/[id]/[day]') return 'plan_day_detail';
    return 'plan_detail';
  }
  if (segments[0] === 'settings') return 'settings';
  if (segments[0] === 'privacy') return 'privacy';
  return 'root_redirect';
}

function AnalyticsRouteTracker() {
  const { isReady, registerSuperProperties, trackScreen } = useAnalytics();
  const { locale } = useI18n();
  const [hasOnboarded] = useHasOnboarded();
  const pathname = usePathname();
  const segments = useSegments();
  const params = useGlobalSearchParams();
  const lastScreenKeyRef = useRef<string | null>(null);

  const segmentList = useMemo(() => [...segments] as string[], [segments]);
  const routeTemplate = useMemo(() => getRouteTemplate(segmentList), [segmentList]);
  const screenName = useMemo(() => getScreenName(segmentList, routeTemplate), [routeTemplate, segmentList]);

  useEffect(() => {
    if (!isReady) return;
    registerSuperProperties({
      locale,
      theme_preference: prefs.getThemePreference(),
      has_onboarded: hasOnboarded ?? false,
    });
  }, [hasOnboarded, isReady, locale, registerSuperProperties]);

  useEffect(() => {
    if (!isReady) return;

    const properties: AnalyticsProperties = {
      path: pathname,
      route_group: cleanGroup(segmentList[0]) ?? 'root',
      tab: segmentList.includes('(hoje)') ? 'today' : segmentList.includes('(explorar)') ? 'explore' : undefined,
      locale,
      has_onboarded: hasOnboarded ?? false,
      book: typeof firstParam(params.book) === 'string' ? firstParam(params.book) as string : undefined,
      chapter: numericParam(params.chapter),
      collection_id: typeof firstParam(params.id) === 'string' && routeTemplate.includes('/collection/')
        ? firstParam(params.id) as string
        : typeof firstParam(params.collection_id) === 'string'
          ? firstParam(params.collection_id) as string
        : undefined,
      source: typeof firstParam(params.source) === 'string' ? firstParam(params.source) as string : undefined,
      plan_id: typeof firstParam(params.id) === 'string' && routeTemplate.startsWith('/plans/')
        ? firstParam(params.id) as string
        : undefined,
      day_number: numericParam(params.day),
      has_verse_param: params.verse !== undefined,
    };
    const screenKey = JSON.stringify([screenName, routeTemplate, pathname, properties.has_verse_param]);
    if (lastScreenKeyRef.current === screenKey) return;
    lastScreenKeyRef.current = screenKey;
    trackScreen(screenName, routeTemplate, properties);
  }, [hasOnboarded, isReady, locale, params, pathname, routeTemplate, screenName, segmentList, trackScreen]);

  return null;
}

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
              <AnalyticsRouteTracker />
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
                <Stack.Screen
                  name="plans"
                  options={{ headerShown: false }}
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

export default Sentry.wrap(function RootLayout() {
  return (
    <AnalyticsProvider>
      <LocaleProvider>
        <AppContent />
      </LocaleProvider>
    </AnalyticsProvider>
  );
});
