import { Stack } from 'expo-router/stack';

export default function HojeLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Hoje' }} />
    </Stack>
  );
}
