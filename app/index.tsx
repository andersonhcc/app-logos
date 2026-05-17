import { Redirect } from 'expo-router';

import { useHasOnboarded } from '@/lib/preferences';

export default function Index() {
  const [hasOnboarded] = useHasOnboarded();
  return <Redirect href={hasOnboarded ? '/(tabs)/(hoje)' : '/(onboarding)'} />;
}
