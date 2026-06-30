import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { ShareCard } from '@/components/share-card';
import { Button } from '@/components/ui/button';
import { GlassPill } from '@/components/ui/glass-pill';
import { Text } from '@/components/ui/text';
import { useActivePlan } from '@/hooks/use-active-plan';
import { formatReference } from '@/lib/bible';
import { generateDaily, saveDailyContent } from '@/lib/generate-daily';
import { shareReflection } from '@/lib/share';
import { shareCardImage } from '@/lib/share-image';
import { reportGeneratedContent } from '@/lib/report-content';
import { useBibleBootstrap } from '@/lib/use-bible-bootstrap';
import { useThemeColors } from '@/theme';
import { useI18n } from '@/lib/i18n';
import { requestReviewAfterCompletedReading } from '@/lib/store-review';

export default function HojeScreen() {
  const c = useThemeColors();
  const db = useSQLiteContext();
  const { locale, t } = useI18n();
  const { ready: bibleReady } = useBibleBootstrap();
  const { loading, plan, theme, dayRecord, passage, completeToday, reload } =
    useActivePlan();
  const cardRef = useRef<View>(null);

  const [genState, setGenState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [genError, setGenError] = useState<string | null>(null);
  const [reportState, setReportState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const generatingFor = useRef<string | null>(null);

  useEffect(() => {
    setReportState('idle');
  }, [plan?.current_day, plan?.id]);

  // Auto-generate reflection + prayer when missing
  useEffect(() => {
    if (!plan || !theme || !passage || !dayRecord) return;
    if (dayRecord.reflection && dayRecord.prayer) return;

    const key = `${plan.id}:${plan.current_day}`;
    if (generatingFor.current === key) return;
    generatingFor.current = key;

    (async () => {
      setGenState('loading');
      setGenError(null);
      try {
        const content = await generateDaily({
          theme: theme.label,
          reference: formatReference(passage),
          passageText: passage.verses.map((v) => v.text).join(' '),
          day: plan.current_day,
          totalDays: plan.days_count,
          locale: plan.locale,
        });
        await saveDailyContent(db, plan.id, plan.current_day, content);
        await reload();
        setGenState('idle');
      } catch (e) {
        generatingFor.current = null;
        setGenState('error');
        setGenError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [db, dayRecord, passage, plan, reload, theme]);

  const onSharePress = () => {
    if (!passage) return;
    const reflection = dayRecord?.reflection;

    const shareImage = async () => {
      try {
        await shareCardImage(cardRef);
      } catch (e) {
        Alert.alert(t('today.shareError'), e instanceof Error ? e.message : String(e));
      }
    };
    const shareText = () => shareReflection({ passage, reflection, theme, locale: plan?.locale ?? locale });

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.cancel'), locale === 'en' ? 'Share image' : 'Compartilhar imagem', locale === 'en' ? 'Share text' : 'Compartilhar texto'],
          cancelButtonIndex: 0,
        },
        (i) => {
          if (i === 1) shareImage();
          else if (i === 2) shareText();
        }
      );
    } else {
      shareImage();
    }
  };

  const submitReport = async () => {
    if (!plan || !theme || !passage || !dayRecord?.reflection || !dayRecord.prayer) return;

    setReportState('sending');
    try {
      await reportGeneratedContent({
        theme: theme.label,
        reference: formatReference(passage),
        day: plan.current_day,
        totalDays: plan.days_count,
        reflection: dayRecord.reflection,
        prayer: dayRecord.prayer,
        locale: plan.locale,
      });
      setReportState('sent');
      Alert.alert(t('today.thanks'), t('today.reportSuccess'));
    } catch {
      setReportState('idle');
      Alert.alert(t('today.submitError'), t('today.tryAgain'));
    }
  };

  const onReportPress = () => {
    Alert.alert(
      t('today.reportTitle'),
      t('today.reportBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('today.reportAction'), onPress: () => void submitReport() },
      ]
    );
  };

  if (loading || !bibleReady) {
    return (
      <View className="flex-1 items-center justify-center bg-bg-base">
        <ActivityIndicator color={c.brand.primary} />
      </View>
    );
  }

  if (!plan || !theme) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-bg-base">
        <Text variant="title" className="text-fg text-center mb-2">
          {t('today.noPlan')}
        </Text>
        <Text variant="body" className="text-fg-secondary text-center">
          {t('today.createPlan')}
        </Text>
      </View>
    );
  }

  const isCompleted = !!dayRecord?.completed_at;
  const isLastDay = plan.current_day >= plan.days_count && isCompleted;
  const isGenerating = genState === 'loading';
  const onCompleteToday = async () => {
    await completeToday();
    if (genState === 'idle') {
      void requestReviewAfterCompletedReading();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-bg-base"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, gap: 28 }}>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
              {theme.label} · {t('today.day', { day: plan.current_day, total: plan.days_count })}
            </Text>
            {passage && <GlassPill label={formatReference(passage)} />}
          </View>
          {passage && passage.verses.length > 0 && (
            <Text variant="hero" className="text-fg">
              {passage.verses[0].text.replace(/\s+/g, ' ').trim()}
            </Text>
          )}
        </View>

        {passage && passage.verses.length > 1 && (
          <View
            className="rounded-2xl bg-bg-elevated border border-border p-5 gap-3"
            style={{ borderCurve: 'continuous' }}>
            <Text variant="subtitle" className="text-brand">
              {t('today.reading')}
            </Text>
            <Text variant="citation" className="text-fg" selectable>
              {passage.verses
                .map((v) => `${v.verse}. ${v.text.replace(/\s+/g, ' ').trim()}`)
                .join('\n\n')}
            </Text>
          </View>
        )}

        <View
          className="rounded-2xl bg-bg-elevated border border-border p-5 gap-3"
          style={{ borderCurve: 'continuous' }}>
          <Text variant="subtitle" className="text-brand">
            {t('today.reflection')}
          </Text>
          {dayRecord?.reflection ? (
            <Text variant="body" className="text-fg" selectable>
              {dayRecord.reflection}
            </Text>
          ) : isGenerating ? (
            <View className="flex-row items-center gap-3">
              <ActivityIndicator color={c.brand.primary} />
              <Text variant="body" className="text-fg-secondary">
                {t('today.generatingReflection')}
              </Text>
            </View>
          ) : genError ? (
            <Text variant="body" className="text-fg-secondary">
              {t('today.generationFailed', { error: genError })}
            </Text>
          ) : (
            <Text variant="body" className="text-fg-secondary">
              {locale === 'en' ? 'Preparing…' : 'Preparando…'}
            </Text>
          )}
        </View>

        <View
          className="rounded-2xl bg-bg-elevated border border-border p-5 gap-3"
          style={{ borderCurve: 'continuous' }}>
          <Text variant="subtitle" className="text-brand">
            {t('today.prayer')}
          </Text>
          {dayRecord?.prayer ? (
            <Text variant="citation" className="text-fg" selectable>
              {dayRecord.prayer}
            </Text>
          ) : isGenerating ? (
            <View className="flex-row items-center gap-3">
              <ActivityIndicator color={c.brand.primary} />
              <Text variant="body" className="text-fg-secondary">
                {t('today.generatingPrayer')}
              </Text>
            </View>
          ) : (
            <Text variant="body" className="text-fg-secondary">
              {genError ? '—' : locale === 'en' ? 'Preparing…' : 'Preparando…'}
            </Text>
          )}
        </View>

        {dayRecord?.reflection && dayRecord.prayer && passage && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('today.report')}
            disabled={reportState !== 'idle'}
            hitSlop={12}
            onPress={onReportPress}
            className="self-center px-3 py-1">
            <Text variant="caption" className="text-fg-tertiary">
              {reportState === 'sending'
                ? locale === 'en' ? 'Sending…' : 'Enviando…'
                : reportState === 'sent'
                  ? t('today.reported')
                  : t('today.report')}
            </Text>
          </Pressable>
        )}

        <View className="gap-3">
          {!isCompleted && <Button label={t('today.markRead')} onPress={onCompleteToday} />}
          {passage && (
            <Button label={t('today.share')} variant="secondary" onPress={onSharePress} />
          )}
          {isCompleted && !isLastDay && (
            <Text variant="body" className="text-fg-secondary text-center">
              {t('today.dayDone')}
            </Text>
          )}
          {isLastDay && (
            <Text variant="title" className="text-fg text-center">
              {t('today.planDone')}
            </Text>
          )}
        </View>
      </ScrollView>

      {passage && (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: -10000, left: -10000 }}>
          <ShareCard
            ref={cardRef}
            passage={passage}
            reflection={dayRecord?.reflection}
            theme={theme}
          />
        </View>
      )}
    </View>
  );
}
