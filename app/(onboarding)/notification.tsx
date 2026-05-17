import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { ThemeId } from '@/lib/themes';

type Choice = { label: string; hour: number; minute: number };

const TIMES: Choice[] = [
  { label: '06:30 — Antes do trabalho', hour: 6, minute: 30 },
  { label: '08:00 — Manhã', hour: 8, minute: 0 },
  { label: '12:00 — Almoço', hour: 12, minute: 0 },
  { label: '19:00 — Fim do dia', hour: 19, minute: 0 },
  { label: '22:00 — Antes de dormir', hour: 22, minute: 0 },
];

export default function NotificationScreen() {
  const router = useRouter();
  const { theme, days } = useLocalSearchParams<{ theme: ThemeId; days: string }>();
  const [selected, setSelected] = useState<Choice | null>(TIMES[1]);

  const go = (notify: boolean) => {
    router.replace({
      pathname: '/(onboarding)/done',
      params: {
        theme,
        days,
        notify: notify ? '1' : '0',
        hour: selected ? String(selected.hour) : '',
        minute: selected ? String(selected.minute) : '',
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-base">
      <View className="flex-1 px-6 pt-6">
        <View className="gap-2 mb-6">
          <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
            Último passo
          </Text>
          <Text variant="title" className="text-fg">
            Lembrete diário?
          </Text>
          <Text variant="body" className="text-fg-secondary">
            Escolha um horário pra receber sua leitura. Você pode mudar depois.
          </Text>
        </View>

        <View className="gap-2">
          {TIMES.map((t) => {
            const isSelected = selected?.hour === t.hour && selected?.minute === t.minute;
            return (
              <Pressable
                key={t.label}
                onPress={() => setSelected(t)}
                className={`rounded-2xl border px-5 py-4 ${
                  isSelected
                    ? 'bg-bg-elevated border-brand'
                    : 'bg-bg-elevated border-border'
                }`}
                style={{ borderCurve: 'continuous' }}>
                <Text variant="body" className="text-fg">
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-1" />

        <View className="gap-2 pb-4">
          <Button label="Ativar lembrete" onPress={() => go(true)} />
          <Button label="Agora não" variant="ghost" onPress={() => go(false)} />
        </View>
      </View>
    </SafeAreaView>
  );
}
