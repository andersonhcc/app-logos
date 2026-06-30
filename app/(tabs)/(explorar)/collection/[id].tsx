import { type Href, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';

import { Text } from '@/components/ui/text';
import { BOOK_BY_SLUG, localizeBook } from '@/lib/bible-books';
import { getCollection } from '@/lib/collections';
import { useI18n } from '@/lib/i18n';

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useI18n();
  const collection = getCollection(id);
  if (!collection) return <Text variant="body" className="p-6 text-fg">Collection not found.</Text>;

  return (
    <ScrollView className="flex-1 bg-bg-base" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 48 }}>
      <Stack.Screen options={{ title: collection.title[locale], headerLargeTitle: false }} />
      {collection.readings.map((reading, index) => {
        const book = localizeBook(BOOK_BY_SLUG[reading.book], locale);
        return (
          <Pressable key={`${reading.book}:${reading.chapter}`} onPress={() => router.push(`/passage/${reading.book}/${reading.chapter}` as Href)}
            className="rounded-2xl bg-bg-elevated border border-border p-4">
            <Text variant="subtitle" className="text-fg">{index + 1}. {book.name} {reading.chapter}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
