import * as Haptics from 'expo-haptics';
import { ActionSheetIOS, Pressable, View } from 'react-native';

import { useI18n } from '@/lib/i18n';

import { Text } from './text';

const OPTIONS = [
  { value: 'nvi', label: 'Nova Versão Internacional' },
  { value: 'ara', label: 'Almeida Revista e Atualizada' },
  { value: 'arc', label: 'Almeida Revista e Corrigida' },
  { value: 'naa', label: 'Nova Almeida Atualizada' },
] as const;

export type TranslationCode = (typeof OPTIONS)[number]['value'];

type Props = { value: TranslationCode; onChange: (next: TranslationCode) => void };

export function TranslationPicker({ value, onChange }: Props) {
  const current = OPTIONS.find((option) => option.value === value)!;
  const { locale, t } = useI18n();

  const open = () => {
    if (process.env.EXPO_OS === 'ios') Haptics.selectionAsync();
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: locale === 'en' ? 'Choose a translation' : 'Escolha a tradução',
        options: [...OPTIONS.map((option) => option.label), t('common.cancel')],
        cancelButtonIndex: OPTIONS.length,
        userInterfaceStyle: 'light',
      },
      (index) => { if (index >= 0 && index < OPTIONS.length) onChange(OPTIONS[index].value); },
    );
  };

  return (
    <Pressable onPress={open} className="flex-row items-center justify-between py-2">
      <View className="gap-0.5">
        <Text variant="caption" className="text-fg-tertiary uppercase tracking-widest">
          {locale === 'en' ? 'Translation' : 'Tradução'}
        </Text>
        <Text variant="body" className="text-fg">{current.label}</Text>
      </View>
      <Text variant="body" className="text-brand">{t('common.change')}</Text>
    </Pressable>
  );
}
