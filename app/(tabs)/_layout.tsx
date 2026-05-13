import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { useThemeColors } from '@/theme';

export default function TabLayout() {
  const c = useThemeColors();

  return (
    <NativeTabs
      tintColor={c.brand.accent}
      blurEffect="systemChromeMaterial"
      minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(hoje)">
        <Icon sf={{ default: 'book.closed', selected: 'book.closed.fill' }} />
        <Label>Hoje</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(explorar)">
        <Icon sf="sparkles" />
        <Label>Explorar</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
