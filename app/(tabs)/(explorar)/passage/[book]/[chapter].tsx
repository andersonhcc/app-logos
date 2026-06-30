import { Stack, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

import { Text } from '@/components/ui/text';
import { getChapter, type Passage } from '@/lib/bible';
import { useI18n } from '@/lib/i18n';

export default function PassageScreen() {
  const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string; verse?: string }>();
  const db = useSQLiteContext();
  const { locale } = useI18n();
  const [passage, setPassage] = useState<Passage | null>();

  useEffect(() => {
    void getChapter(db, { book, chapter: Number(chapter) }, locale).then(setPassage);
  }, [book, chapter, db, locale]);

  if (passage === undefined) return <ActivityIndicator className="flex-1" />;
  if (!passage) return <Text variant="body" className="p-6 text-fg">Passage not found.</Text>;
  const title = `${passage.book.name} ${passage.chapter}`;
  return (
    <ScrollView className="flex-1 bg-bg-base" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 48 }}>
      <Stack.Screen options={{ title, headerLargeTitle: false }} />
      <Text variant="title" className="text-fg">{title}</Text>
      {passage.verses.map((item) => <Text key={item.verse} variant="citation" className="text-fg" selectable><Text variant="caption" className="text-brand">{item.verse} </Text>{item.text}</Text>)}
    </ScrollView>
  );
}
