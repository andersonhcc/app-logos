import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
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
import { useBibleBootstrap } from '@/lib/use-bible-bootstrap';
import { useThemeColors } from '@/theme';

export default function HojeScreen() {
  const c = useThemeColors();
  const db = useSQLiteContext();
  const { ready: bibleReady } = useBibleBootstrap();
  const { loading, plan, theme, dayRecord, passage, completeToday, reload } =
    useActivePlan();
  const cardRef = useRef<View>(null);

  const [genState, setGenState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [genError, setGenError] = useState<string | null>(null);
  const generatingFor = useRef<string | null>(null);

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
        Alert.alert('Erro ao compartilhar', e instanceof Error ? e.message : String(e));
      }
    };
    const shareText = () => shareReflection({ passage, reflection, theme });

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Compartilhar imagem', 'Compartilhar texto'],
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
          Nenhum plano ativo
        </Text>
        <Text variant="body" className="text-fg-secondary text-center">
          Crie um plano de leitura pra começar.
        </Text>
      </View>
    );
  }

  const isCompleted = !!dayRecord?.completed_at;
  const isLastDay = plan.current_day >= plan.days_count && isCompleted;
  const isGenerating = genState === 'loading';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-bg-base"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, gap: 28 }}>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
              {theme.label} · Dia {plan.current_day} de {plan.days_count}
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
              Passagem completa
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
            Reflexão
          </Text>
          {dayRecord?.reflection ? (
            <Text variant="body" className="text-fg" selectable>
              {dayRecord.reflection}
            </Text>
          ) : isGenerating ? (
            <View className="flex-row items-center gap-3">
              <ActivityIndicator color={c.brand.primary} />
              <Text variant="body" className="text-fg-secondary">
                Gerando reflexão personalizada…
              </Text>
            </View>
          ) : genError ? (
            <Text variant="body" className="text-fg-secondary">
              Não foi possível gerar agora. {genError}
            </Text>
          ) : (
            <Text variant="body" className="text-fg-secondary">
              Preparando…
            </Text>
          )}
        </View>

        <View
          className="rounded-2xl bg-bg-elevated border border-border p-5 gap-3"
          style={{ borderCurve: 'continuous' }}>
          <Text variant="subtitle" className="text-brand">
            Oração
          </Text>
          {dayRecord?.prayer ? (
            <Text variant="citation" className="text-fg" selectable>
              {dayRecord.prayer}
            </Text>
          ) : isGenerating ? (
            <View className="flex-row items-center gap-3">
              <ActivityIndicator color={c.brand.primary} />
              <Text variant="body" className="text-fg-secondary">
                Gerando oração…
              </Text>
            </View>
          ) : (
            <Text variant="body" className="text-fg-secondary">
              {genError ? '—' : 'Preparando…'}
            </Text>
          )}
        </View>

        <View className="gap-3">
          {!isCompleted && <Button label="Marcar como lido" onPress={completeToday} />}
          {passage && (
            <Button label="Compartilhar" variant="secondary" onPress={onSharePress} />
          )}
          {isCompleted && !isLastDay && (
            <Text variant="body" className="text-fg-secondary text-center">
              Você concluiu este dia. Volte amanhã pra próxima leitura.
            </Text>
          )}
          {isLastDay && (
            <Text variant="title" className="text-fg text-center">
              Plano concluído.
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
