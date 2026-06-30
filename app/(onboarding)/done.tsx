import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { generatePlan, sanitizeDays, savePlanDays } from '@/lib/generate-plan';
import { notifications } from '@/lib/notifications';
import { createPlan } from '@/lib/plans';
import { PREF_KEYS, prefs, storage } from '@/lib/preferences';
import { getTheme, type ThemeId } from '@/lib/themes';
import { useBibleBootstrap } from '@/lib/use-bible-bootstrap';
import { useThemeColors } from '@/theme';
import { useI18n } from '@/lib/i18n';

type Stage = 'bible' | 'plan' | 'ai' | 'done';

export default function DoneScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const c = useThemeColors();
  const { locale, t } = useI18n();
  const { theme, days, notify, hour, minute } = useLocalSearchParams<{
    theme: ThemeId;
    days: string;
    notify?: string;
    hour?: string;
    minute?: string;
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

        setStage('plan');
        const planId = await createPlan(db, { theme: themeDef.id, days: numDays, locale });
        prefs.setActivePlanId(planId);

        setStage('ai');
        const result = await generatePlan({ theme: themeDef.label, days: numDays, locale });
        const validDays = sanitizeDays(result.days);
        if (validDays.length === 0) {
          throw new Error(locale === 'en' ? 'The model returned no valid passages' : 'Modelo não retornou passagens válidas');
        }
        await savePlanDays(db, planId, validDays);

        if (notify === '1' && hour && minute) {
          const granted = await notifications.request();
          if (granted) {
            await notifications.schedule(Number(hour), Number(minute));
          }
        }

        prefs.setOnboarded(true);
        setStage('done');
        setTimeout(() => router.replace('/(tabs)/(hoje)'), 400);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [bibleReady, db, days, hour, locale, minute, notify, processingAcknowledged, router, theme]);

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
          <Pressable onPress={() => router.push('/privacy')}>
            <Text variant="body" className="text-brand text-center">{t('settings.privacy')}</Text>
          </Pressable>
          <Button label={t('common.continue')} onPress={() => {
            storage.set(PREF_KEYS.remoteProcessingAcknowledged, true);
            setProcessingAcknowledged(true);
          }} />
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
