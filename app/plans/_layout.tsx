import { HeaderButton } from '@react-navigation/elements';
import { SymbolView } from 'expo-symbols';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { useI18n } from '@/lib/i18n';
import { useThemeColors } from '@/theme';

export default function PlansLayout() {
  const { t } = useI18n();
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen
        name="index"
        options={{
          title: t('plans.myPlans'),
          headerLeft: ({ tintColor }) => (
            <HeaderButton
              accessibilityLabel={t('common.back')}
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace('/(tabs)/(hoje)');
              }}>
              <SymbolView
                name="chevron.left"
                size={20}
                tintColor={tintColor ?? colors.text.primary}
                style={styles.backIcon}
              />
            </HeaderButton>
          ),
        }}
      />
      <Stack.Screen name="[id]/index" options={{ title: t('plans.planDetails') }} />
      <Stack.Screen name="[id]/[day]" options={{ title: t('plans.dayDetails') }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    width: 28,
    height: 28,
  },
});
