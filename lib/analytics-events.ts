import type { SupportedLocale } from './i18n';
import type { ThemePreference } from './preferences';

export const AnalyticsEvents = {
  APP_OPENED: 'app_opened',
  SCREEN_VIEW: 'screen_view',
  ONBOARDING_STARTED: 'onboarding_started',
  APPEARANCE_SELECTED: 'appearance_selected',
  PLAN_THEME_SELECTED: 'plan_theme_selected',
  PLAN_DURATION_SELECTED: 'plan_duration_selected',
  NOTIFICATION_TIME_SELECTED: 'notification_time_selected',
  NOTIFICATION_PERMISSION_REQUESTED: 'notification_permission_requested',
  NOTIFICATION_PERMISSION_RESULT: 'notification_permission_result',
  REMOTE_PROCESSING_ACKNOWLEDGED: 'remote_processing_acknowledged',
  PLAN_GENERATION_STARTED: 'plan_generation_started',
  PLAN_GENERATION_SUCCEEDED: 'plan_generation_succeeded',
  PLAN_GENERATION_FAILED: 'plan_generation_failed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NEW_PLAN_STARTED: 'new_plan_started',
  PLAN_CHANGE_CONFIRMED: 'plan_change_confirmed',
  DAILY_CONTENT_GENERATION_STARTED: 'daily_content_generation_started',
  DAILY_CONTENT_GENERATION_SUCCEEDED: 'daily_content_generation_succeeded',
  DAILY_CONTENT_GENERATION_FAILED: 'daily_content_generation_failed',
  DAILY_READING_COMPLETED: 'daily_reading_completed',
  DAILY_SHARE_STARTED: 'daily_share_started',
  DAILY_SHARE_COMPLETED: 'daily_share_completed',
  DAILY_SHARE_FAILED: 'daily_share_failed',
  CONTENT_REPORT_OPENED: 'content_report_opened',
  CONTENT_REPORT_SUBMITTED: 'content_report_submitted',
  CONTENT_REPORT_SUCCEEDED: 'content_report_succeeded',
  CONTENT_REPORT_FAILED: 'content_report_failed',
  PLAN_COMPLETED: 'plan_completed',
  EXPLORE_SEARCH_PERFORMED: 'explore_search_performed',
  SEARCH_RESULT_OPENED: 'search_result_opened',
  COLLECTION_OPENED: 'collection_opened',
  COLLECTION_READING_OPENED: 'collection_reading_opened',
  PASSAGE_OPENED: 'passage_opened',
  SETTINGS_THEME_CHANGED: 'settings_theme_changed',
  SETTINGS_LANGUAGE_CHANGED: 'settings_language_changed',
  REMINDER_TIME_CHANGED: 'reminder_time_changed',
  REMINDER_ENABLED: 'reminder_enabled',
  REMINDER_DISABLED: 'reminder_disabled',
  WIDGET_INSTRUCTIONS_OPENED: 'widget_instructions_opened',
  PRIVACY_OPENED: 'privacy_opened',
  EXTERNAL_LINK_OPENED: 'external_link_opened',
  DEBUG_MIXPANEL_TEST: 'debug_mixpanel_test',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsScreenName =
  | 'root_redirect'
  | 'onboarding_welcome'
  | 'onboarding_appearance'
  | 'onboarding_theme'
  | 'onboarding_duration'
  | 'onboarding_notification'
  | 'onboarding_done'
  | 'today'
  | 'explore'
  | 'collection_detail'
  | 'passage_detail'
  | 'plans_list'
  | 'plan_detail'
  | 'plan_day_detail'
  | 'settings'
  | 'privacy';

export type AnalyticsFlow = 'onboarding' | 'new_plan';
export type ShareType = 'image' | 'text';

export type AnalyticsPropertyValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | boolean[];

export type AnalyticsProperties = Record<string, AnalyticsPropertyValue>;

export type AnalyticsSuperProperties = {
  app_version?: string;
  environment: 'development' | 'production';
  platform: string;
  locale: SupportedLocale;
  theme_preference: ThemePreference;
  has_onboarded: boolean;
};

export function normalizeAnalyticsFlow(flow?: string | string[] | null): AnalyticsFlow {
  const value = Array.isArray(flow) ? flow[0] : flow;
  return value === 'new-plan' || value === 'new_plan' ? 'new_plan' : 'onboarding';
}
