import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/lib/analytics';
import { AnalyticsEvents, normalizeAnalyticsFlow } from '@/lib/analytics-events';
import { generatePlan, sanitizeDays, type StoredPassage } from '@/lib/generate-plan';
import { notifications } from '@/lib/notifications';
import { replaceActivePlan } from '@/lib/plans';
import { PREF_KEYS, prefs, storage } from '@/lib/preferences';
import { getTheme, type ThemeId } from '@/lib/themes';
import { useBibleBootstrap } from '@/lib/use-bible-bootstrap';
import { useThemeColors } from '@/theme';
import { useI18n } from '@/lib/i18n';
import { syncDailyVerseWidget } from '@/lib/daily-verse-widget';

type Stage = 'bible' | 'plan' | 'ai' | 'done';

export default function DoneScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const c = useThemeColors();
  const { registerSuperProperties, track } = useAnalytics();
  const { locale, t } = useI18n();
  const { theme, days, notify, hour, minute, flow } = useLocalSearchParams<{
    theme: ThemeId;
    days: string;
    notify?: string;
    hour?: string;
    minute?: string;
    flow?: string;
  }>();
  const { ready: bibleReady, error: bibleError } = useBibleBootstrap();
  const ran = useRef(false);
  const [stage, setStage] = useState<Stage>('bible');
  const [error, setError] = useState<string | null>(null);
  const [processingAcknowledged, setProcessingAcknowledged] = useState(
    () => storage.getBoolean(PREF_KEYS.remoteProcessingAcknowledged) ?? false,
  );

  useEffect(() => {
    if (!bibleReady || !processingAcknowledged || ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const themeDef = getTheme(theme, locale);
        const numDays = Number(days);
        if (!themeDef || !Number.isFinite(numDays)) {
          router.replace('/(onboarding)');
          return;
        }

        setStage('ai');
        const analyticsFlow = normalizeAnalyticsFlow(flow);
        track(AnalyticsEvents.PLAN_GENERATION_STARTED, {
          theme_id: themeDef.id,
          days_count: numDays,
          locale,
          flow: analyticsFlow,
        });
        const result = await generatePlan({ theme: themeDef.label, days: numDays, locale });
        const validDays = sanitizeDays(result.days);
        if (validDays.length === 0) {
          throw new Error(locale === 'en' ? 'The model returned no valid passages' : 'Modelo não retornou passagens válidas');
        }
        setStage('plan');
        const planId = await replaceActivePlan(
          db,
          { theme: themeDef.id, days: numDays, locale },
          validDays.map((day) => {
            const passage: StoredPassage = {
              book: day.book,
              chapter: day.chapter,
              verseStart: day.verse_start,
              verseEnd: day.verse_end,
              summary: day.summary,
            };
            return { day: day.day, passagesJson: JSON.stringify(passage) };
          })
        );
        prefs.setActivePlanId(planId);

        if (notify === '1' && hour && minute) {
          await notifications.schedule(Number(hour), Number(minute));
        }

        prefs.setOnboarded(true);
        registerSuperProperties({ has_onboarded: true });
        track(AnalyticsEvents.PLAN_GENERATION_SUCCEEDED, {
          plan_id: String(planId),
          days_count: numDays,
          flow: analyticsFlow,
        });
        if (analyticsFlow === 'onboarding') {
          track(AnalyticsEvents.ONBOARDING_COMPLETED, {
            plan_id: String(planId),
            days_count: numDays,
            notifications_enabled: notify === '1',
          });
        }
        await syncDailyVerseWidget(db);
        setStage('done');
        if (!storage.getBoolean(PREF_KEYS.widgetEducationShown)) {
          storage.set(PREF_KEYS.widgetEducationShown, true);
          Alert.alert(t('settings.widgetInstructionsTitle'), t('settings.widgetInstructions'), [
            { text: t('common.continue'), onPress: () => router.replace('/(tabs)/(hoje)') },
          ]);
        } else {
          setTimeout(() => router.replace('/(tabs)/(hoje)'), 400);
        }
      } catch (e) {
        track(AnalyticsEvents.PLAN_GENERATION_FAILED, {
          error_type: e instanceof Error && e.name ? e.name : 'unknown',
          flow: normalizeAnalyticsFlow(flow),
        });
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [bibleReady, db, days, flow, hour, locale, minute, notify, processingAcknowledged, registerSuperProperties, router, t, theme, track]);

  const displayError = bibleError ?? error;

  if (!processingAcknowledged) {
    return (
      <SafeAreaView className="flex-1 bg-bg-base">
        <View className="flex-1 justify-center gap-6 px-6">
          <Text variant="title" className="text-fg text-center">
            {locale === 'en' ? 'Remote processing' : 'Processamento remoto'}
          </Text>
          <Text variant="body" className="text-fg-secondary text-center">
            {locale === 'en'
              ? 'To personalize your plan, the selected theme and Bible passages will be processed by Supabase and OpenAI.'
              : 'Para personalizar seu plano, o tema escolhido e as passagens bíblicas serão processados pelo Supabase e pela OpenAI.'}
          </Text>
          <Pressable onPress={() => {
            track(AnalyticsEvents.PRIVACY_OPENED, { source: 'remote_processing_notice' });
            router.push('/privacy');
          }}>
            <Text variant="body" className="text-brand text-center">{t('settings.privacy')}</Text>
          </Pressable>
          <Button
            label={t('common.continue')}
            onPress={() => {
              track(AnalyticsEvents.REMOTE_PROCESSING_ACKNOWLEDGED);
              storage.set(PREF_KEYS.remoteProcessingAcknowledged, true);
              setProcessingAcknowledged(true);
            }}
          />
          <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        {displayError ? (
          <>
            <Text variant="title" className="text-fg text-center">
              {locale === 'en' ? 'Unable to prepare' : 'Erro ao preparar'}
            </Text>
            <Text variant="body" className="text-fg-secondary text-center">
              {displayError}
            </Text>
          </>
        ) : (
          <>
            <ActivityIndicator color={c.brand.primary} />
            <Text variant="title" className="text-fg text-center">
              {t('onboarding.preparing')}
            </Text>
            <Text variant="body" className="text-fg-secondary text-center">
              {stage === 'bible' ? t('onboarding.stepBible') : stage === 'plan' ? t('onboarding.stepPlan') : stage === 'ai' ? t('onboarding.stepContent') : t('onboarding.prepared')}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
