import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEMES, type ThemeId } from '@/lib/themes';
import { useThemeColors } from '@/theme';

export default function ThemeScreen() {
  const router = useRouter();
  const c = useThemeColors();
  const [selected, setSelected] = useState<ThemeId | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-6 pt-6">
        <View className="gap-2 mb-6">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            Passo 1 de 2
          </Text>
          <Text variant="title" className="text-fg">
            O que está no seu coração hoje?
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 24, gap: 12 }}>
          {THEMES.map((t) => {
            const isSelected = selected === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => setSelected(t.id)}
                className={`flex-row items-center gap-4 rounded-2xl border px-4 py-4 ${
                  isSelected
                    ? 'bg-bg-elevated border-brand'
                    : 'bg-bg-elevated border-border'
                }`}
                style={{ borderCurve: 'continuous' }}>
                <View
                  className="size-11 rounded-full items-center justify-center"
                  style={{ backgroundColor: c.bg.sunken }}>
                  <SymbolView
                    name={t.symbol as any}
                    size={20}
                    tintColor={isSelected ? c.brand.primary : c.text.secondary}
                  />
                </View>
                <View className="flex-1">
                  <Text variant="subtitle" className="text-fg">
                    {t.label}
                  </Text>
                  <Text variant="bodySmall" className="text-fg-secondary">
                    {t.description}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="pb-4">
          <Button
            label="Continuar"
            disabled={!selected}
            onPress={() =>
              selected &&
              router.push({
                pathname: '/(onboarding)/duration',
                params: { theme: selected },
              })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
