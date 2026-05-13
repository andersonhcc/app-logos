import * as Haptics from 'expo-haptics';
import { ActionSheetIOS, Pressable, View } from 'react-native';

import { Text } from './text';

const OPTIONS = [
  { value: 'nvi', label: 'Nova Versão Internacional' },
  { value: 'ara', label: 'Almeida Revista e Atualizada' },
  { value: 'arc', label: 'Almeida Revista e Corrigida' },
  { value: 'naa', label: 'Nova Almeida Atualizada' },
] as const;

export type TranslationCode = (typeof OPTIONS)[number]['value'];

type Props = {
  value: TranslationCode;
  onChange: (next: TranslationCode) => void;
};

export function TranslationPicker({ value, onChange }: Props) {
  const current = OPTIONS.find((o) => o.value === value)!;

  const open = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.selectionAsync();
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Escolha a tradução',
        options: [...OPTIONS.map((o) => o.label), 'Cancelar'],
        cancelButtonIndex: OPTIONS.length,
        userInterfaceStyle: 'light',
      },
      (idx) => {
        if (idx >= 0 && idx < OPTIONS.length) onChange(OPTIONS[idx].value);
      }
    );
  };

  return (
    <Pressable onPress={open} className="flex-row items-center justify-between py-2">
      <View className="gap-0.5">
        <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
          Tradução
        </Text>
        <Text variant="body" className="text-fg">
          {current.label}
        </Text>
      </View>
      <Text variant="body" className="text-brand">
        Trocar
      </Text>
    </Pressable>
  );
}
