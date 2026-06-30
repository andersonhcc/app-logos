import { Stack } from 'expo-router/stack';
import { useRouter } from 'expo-router';
import { HeaderButton } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useI18n } from '@/lib/i18n';
import { useThemeColors } from '@/theme';

export default function HojeLayout() {
  const { t } = useI18n();
  const router = useRouter();
  const colors = useThemeColors();
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
      <Stack.Screen name="index" options={{
        title: t('tabs.today'),
        headerRight: ({ tintColor }) => (
          <HeaderButton
            accessibilityLabel={t('settings.title')}
            onPress={() => router.push('/settings' as never)}>
            <SymbolView
              name="gearshape"
              size={20}
              tintColor={tintColor ?? colors.text.primary}
              style={styles.settingsIcon}
            />
          </HeaderButton>
        ),
      }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  settingsIcon: {
    width: 30,
    height: 30,
  },
});
