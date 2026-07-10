import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { useThemeColors } from '@/theme';
import { useI18n } from '@/lib/i18n';

export default function TabLayout() {
  const c = useThemeColors();
  const { locale, t } = useI18n();

  return (
    <NativeTabs
      key={locale}
      tintColor={c.brand.accent}
      minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(hoje)">
        <Icon sf={{ default: 'book.closed', selected: 'book.closed.fill' }} />
        <Label>{t('tabs.today')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(explorar)">
        <Icon sf="sparkles" />
        <Label>{t('tabs.explore')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
