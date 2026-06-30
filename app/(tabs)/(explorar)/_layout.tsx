import { Stack } from 'expo-router/stack';
import { useI18n } from '@/lib/i18n';

export default function ExplorarLayout() {
  const { t } = useI18n();
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerLargeTitle: true,
        headerBlurEffect: 'systemChromeMaterial',
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: t('tabs.explore'),
        }}
      />
    </Stack>
  );
}
