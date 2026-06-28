import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';

const collections = [
  { id: '1', title: 'Salmos para a manhã', count: 14 },
  { id: '2', title: 'Evangelho de João', count: 21 },
  { id: '3', title: 'Cartas de Paulo', count: 13 },
  { id: '4', title: 'Provérbios diários', count: 31 },
];

export default function ExplorarScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-bg-base"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48, gap: 16, paddingTop: 8 }}>
      <Text variant="body" className="text-fg-secondary">
        Coleções e planos curados.
      </Text>
      {collections.map((item) => (
        <View
          key={item.id}
          className="rounded-2xl bg-bg-elevated border border-border p-5 gap-1"
          style={{ borderCurve: 'continuous' }}>
          <Text variant="title" className="text-fg">
            {item.title}
          </Text>
          <Text variant="caption" className="text-fg-tertiary">
            {item.count} leituras
          </Text>
        </View>
      ))}
      <Pressable
        accessibilityRole="link"
        hitSlop={12}
        onPress={() => router.push('/privacy')}
        className="self-center px-3 py-2 mt-2">
        <Text variant="caption" className="text-fg-tertiary">
          Privacidade
        </Text>
      </Pressable>
    </ScrollView>
  );
}
