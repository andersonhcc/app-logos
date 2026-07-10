import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { Mixpanel } from 'mixpanel-react-native';

import {
  AnalyticsEvents,
  type AnalyticsEventName,
  type AnalyticsProperties,
  type AnalyticsScreenName,
  type AnalyticsSuperProperties,
} from './analytics-events';

type AnalyticsContextValue = {
  isReady: boolean;
  track: (eventName: AnalyticsEventName | string, properties?: AnalyticsProperties) => void;
  trackScreen: (
    screenName: AnalyticsScreenName,
    routeTemplate: string,
    properties?: AnalyticsProperties,
  ) => void;
  flush: () => void;
  setProfileProperties: (properties: AnalyticsProperties) => void;
  registerSuperProperties: (properties: Partial<AnalyticsSuperProperties>) => void;
};

const MIXPANEL_TOKEN = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN?.trim();

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

function sanitizeProperties(properties?: AnalyticsProperties) {
  if (!properties) return undefined;

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  ) as AnalyticsProperties;
}

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const mixpanelRef = useRef<Mixpanel | null>(null);
  const didTrackAppOpenedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initializeMixpanel() {
      if (!MIXPANEL_TOKEN) {
        if (__DEV__) {
          console.info('[analytics] EXPO_PUBLIC_MIXPANEL_TOKEN not set; Mixpanel disabled.');
        }
        return;
      }

      try {
        const trackAutomaticEvents = false;
        const useNative = false;
        const mixpanel = new Mixpanel(MIXPANEL_TOKEN, trackAutomaticEvents, useNative, AsyncStorage);

        mixpanel.setLoggingEnabled(false);
        await mixpanel.init(false);
        mixpanel.registerSuperProperties({
          app_version: Constants.expoConfig?.version,
          environment: __DEV__ ? 'development' : 'production',
          platform: Platform.OS,
        });

        if (!isMounted) return;

        mixpanelRef.current = mixpanel;
        setIsReady(true);

        if (!didTrackAppOpenedRef.current) {
          didTrackAppOpenedRef.current = true;
          mixpanel.track(AnalyticsEvents.APP_OPENED);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[analytics] Failed to initialize Mixpanel.', error);
        }
      }
    }

    initializeMixpanel();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        mixpanelRef.current?.flush();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const track = useCallback((eventName: AnalyticsEventName | string, properties?: AnalyticsProperties) => {
    mixpanelRef.current?.track(eventName, sanitizeProperties(properties));
  }, []);

  const trackScreen = useCallback((
    screenName: AnalyticsScreenName,
    routeTemplate: string,
    properties?: AnalyticsProperties,
  ) => {
    mixpanelRef.current?.track(
      AnalyticsEvents.SCREEN_VIEW,
      sanitizeProperties({
        ...properties,
        screen_name: screenName,
        route_template: routeTemplate,
      }),
    );
  }, []);

  const flush = useCallback(() => {
    mixpanelRef.current?.flush();
  }, []);

  const setProfileProperties = useCallback((properties: AnalyticsProperties) => {
    mixpanelRef.current?.getPeople().set(sanitizeProperties(properties) ?? {});
  }, []);

  const registerSuperProperties = useCallback((properties: Partial<AnalyticsSuperProperties>) => {
    mixpanelRef.current?.registerSuperProperties(sanitizeProperties(properties as AnalyticsProperties) ?? {});
  }, []);

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      isReady,
      track,
      trackScreen,
      flush,
      setProfileProperties,
      registerSuperProperties,
    }),
    [flush, isReady, registerSuperProperties, setProfileProperties, track, trackScreen],
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }

  return context;
}
