import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { GlassPill } from '@/components/ui/glass-pill';
import { Text } from '@/components/ui/text';
import { TranslationPicker, type TranslationCode } from '@/components/ui/translation-picker';
import { useThemeColors } from '@/theme';

export default function HojeScreen() {
  const c = useThemeColors();
  const sheetRef = useRef<BottomSheet>(null);
  const [translation, setTranslation] = useState<TranslationCode>('nvi');

  return (
    <View className="flex-1 bg-bg-base">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, gap: 32 }}>
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
              12 de maio · Terça
            </Text>
            <GlassPill label={translation.toUpperCase()} />
          </View>
          <Text variant="hero" className="text-fg">
            No princípio era o Verbo.
          </Text>
          <Text variant="bodySmall" className="text-fg-secondary">
            João 1:1 · Leitura do dia
          </Text>
        </View>

        <View
          className="rounded-2xl bg-bg-elevated border border-border px-4 py-2"
          style={{ borderCurve: 'continuous' }}>
          <TranslationPicker value={translation} onChange={setTranslation} />
        </View>

        <View
          className="rounded-2xl bg-bg-elevated border border-border p-5 gap-3"
          style={{ borderCurve: 'continuous' }}>
          <Text variant="subtitle" className="text-brand">
            Reflexão
          </Text>
          <Text variant="citation" className="text-fg" selectable>
            “No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.”
          </Text>
          <Text variant="body" className="text-fg-secondary">
            João abre seu evangelho ecoando Gênesis. O Logos não é uma ideia abstrata — é
            pessoa, é presença, é princípio.
          </Text>
        </View>

        <View className="gap-3">
          <Button label="Continuar leitura" onPress={() => sheetRef.current?.expand()} />
          <Button label="Marcar como lido" variant="secondary" />
          <Button label="Compartilhar" variant="ghost" />
        </View>

        <View className="gap-2">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            Paleta
          </Text>
          <View className="flex-row gap-2">
            <View
              className="size-12 rounded-lg bg-cream-100 border border-border"
              style={{ borderCurve: 'continuous' }}
            />
            <View
              className="size-12 rounded-lg bg-navy-600"
              style={{ borderCurve: 'continuous' }}
            />
            <View
              className="size-12 rounded-lg bg-gold-500"
              style={{ borderCurve: 'continuous' }}
            />
            <View
              className="size-12 rounded-lg bg-wine-500"
              style={{ borderCurve: 'continuous' }}
            />
            <View
              className="size-12 rounded-lg bg-sage-500"
              style={{ borderCurve: 'continuous' }}
            />
            <View
              className="size-12 rounded-lg bg-ink-500"
              style={{ borderCurve: 'continuous' }}
            />
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['45%', '85%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: c.bg.elevated }}
        handleIndicatorStyle={{ backgroundColor: c.text.tertiary }}>
        <BottomSheetView className="px-5 pt-2 pb-10 gap-3">
          <Text variant="title" className="text-fg">
            João 1
          </Text>
          <Text variant="body" className="text-fg-secondary" selectable>
            ¹ No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.
            {'\n\n'}² Ele estava no princípio com Deus.
            {'\n\n'}³ Todas as coisas foram feitas por intermédio dele, e sem ele nada do que
            foi feito se fez.
            {'\n\n'}⁴ Nele estava a vida, e a vida era a luz dos homens.
          </Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
