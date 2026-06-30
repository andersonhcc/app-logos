import { type Href, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';

import { Text } from '@/components/ui/text';
import { searchBible, type BibleSearchResult } from '@/lib/bible';
import { COLLECTIONS } from '@/lib/collections';
import { useI18n } from '@/lib/i18n';
import { useBibleBootstrap } from '@/lib/use-bible-bootstrap';
import { useThemeColors } from '@/theme';

export default function ExplorarScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const colors = useThemeColors();
  const { locale, t } = useI18n();
  const { ready } = useBibleBootstrap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BibleSearchResult[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!ready || query.trim().length < 2) {
        setResults([]);
        return;
      }
      void searchBible(db, query, locale).then(setResults);
    }, 300);
    return () => clearTimeout(timer);
  }, [db, locale, query, ready]);

  return (
    <ScrollView className="flex-1 bg-bg-base" contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, gap: 14, paddingTop: 8 }}>
      <TextInput
        accessibilityLabel={t('explore.search')}
        value={query}
        onChangeText={setQuery}
        placeholder={t('explore.search')}
        placeholderTextColor={colors.text.tertiary}
        style={{ color: colors.text.primary, backgroundColor: colors.bg.elevated, borderColor: colors.border.DEFAULT, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 }}
      />

      {query.trim().length >= 2 ? results.map((result) => (
        <Pressable key={`${result.book.id}:${result.chapter}:${result.verse}`}
          onPress={() => router.push(`/passage/${result.book.slug}/${result.chapter}?verse=${result.verse}` as Href)}
          className="rounded-2xl bg-bg-elevated border border-border p-4 gap-1">
          <Text variant="subtitle" className="text-fg">{result.book.name} {result.chapter}:{result.verse}</Text>
          <Text variant="bodySmall" className="text-fg-secondary" numberOfLines={3}>{result.text}</Text>
        </Pressable>
      )) : (
        <>
          <Text variant="body" className="text-fg-secondary">{t('explore.subtitle')}</Text>
          {COLLECTIONS.map((item) => (
            <Pressable key={item.id} onPress={() => router.push(`/collection/${item.id}` as Href)}
              className="rounded-2xl bg-bg-elevated border border-border p-5 gap-1">
              <Text variant="title" className="text-fg">{item.title[locale]}</Text>
              <Text variant="caption" className="text-fg-tertiary">{t('explore.plans', { count: item.readings.length })}</Text>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}
