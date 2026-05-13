import { Stack } from 'expo-router/stack';

export default function ExplorarLayout() {
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
          title: 'Explorar',
          headerSearchBarOptions: {
            placeholder: 'Buscar versículos, livros…',
            hideWhenScrolling: false,
          },
        }}
      />
    </Stack>
  );
}
