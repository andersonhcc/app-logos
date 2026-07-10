import { HeaderButton } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';

import { Text } from '@/components/ui/text';
import { BOOK_BY_SLUG, localizeBook } from '@/lib/bible-books';
import { getCollection } from '@/lib/collections';
import { useI18n } from '@/lib/i18n';

export default function ExplorarLayout() {
  const { locale, t } = useI18n();
  const router = useRouter();
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
          headerRight: () => (
            <HeaderButton
              accessibilityLabel={t('plans.myPlans')}
              onPress={() => router.push('/plans')}>
              <Text variant="bodySmall" className="text-brand">
                {t('plans.myPlans')}
              </Text>
            </HeaderButton>
          ),
        }}
      />
      <Stack.Screen
        name="collection/[id]"
        options={({ route }) => {
          const { id } = (route.params ?? {}) as { id?: string };
          return {
            title: id ? getCollection(id)?.title[locale] ?? '' : '',
            headerLargeTitle: false,
          };
        }}
      />
      <Stack.Screen
        name="passage/[book]/[chapter]"
        options={({ route }) => {
          const { book, chapter } = (route.params ?? {}) as { book?: string; chapter?: string };
          const bookDefinition = book ? BOOK_BY_SLUG[book] : undefined;
          const bookName = bookDefinition ? localizeBook(bookDefinition, locale).name : '';
          return {
            title: bookName && chapter ? `${bookName} ${chapter}` : '',
            headerLargeTitle: false,
          };
        }}
      />
    </Stack>
  );
}
