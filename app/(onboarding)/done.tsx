import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { generatePlan, sanitizeDays, savePlanDays } from '@/lib/generate-plan';
import { notifications } from '@/lib/notifications';
import { createPlan } from '@/lib/plans';
import { prefs } from '@/lib/preferences';
import { getTheme, type ThemeId } from '@/lib/themes';
import { useBibleBootstrap } from '@/lib/use-bible-bootstrap';
import { useThemeColors } from '@/theme';

type Stage = 'bible' | 'plan' | 'ai' | 'done';

const STAGE_LABEL: Record<Stage, string> = {
  bible: 'Indexando a Bíblia no dispositivo…',
  plan: 'Criando seu plano…',
  ai: 'Gerando passagens personalizadas com IA…',
  done: 'Pronto!',
};

export default function DoneScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const c = useThemeColors();
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

  useEffect(() => {
    if (!bibleReady || ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const themeDef = getTheme(theme);
        const numDays = Number(days);
        if (!themeDef || !Number.isFinite(numDays)) {
          router.replace('/(onboarding)');
          return;
        }

        setStage('plan');
        const planId = await createPlan(db, { theme: themeDef.id, days: numDays });
        prefs.setActivePlanId(planId);

        setStage('ai');
        const result = await generatePlan({ theme: themeDef.label, days: numDays });
        const validDays = sanitizeDays(result.days);
        if (validDays.length === 0) {
          throw new Error('Modelo não retornou passagens válidas');
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
  }, [bibleReady, db, days, hour, minute, notify, router, theme]);

  const displayError = bibleError ?? error;

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        {displayError ? (
          <>
            <Text variant="title" className="text-fg text-center">
              Erro ao preparar
            </Text>
            <Text variant="body" className="text-fg-secondary text-center">
              {displayError}
            </Text>
          </>
        ) : (
          <>
            <ActivityIndicator color={c.brand.primary} />
            <Text variant="title" className="text-fg text-center">
              Preparando sua leitura…
            </Text>
            <Text variant="body" className="text-fg-secondary text-center">
              {STAGE_LABEL[stage]}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
