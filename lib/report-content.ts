import { invokeFunction } from './supabase';
import type { SupportedLocale } from './i18n';

export type ContentReportInput = {
  theme: string;
  reference: string;
  day: number;
  totalDays: number;
  reflection: string;
  prayer: string;
  locale: SupportedLocale;
};

export async function reportGeneratedContent(input: ContentReportInput) {
  return invokeFunction<ContentReportInput, { accepted: true }>('report-content', input);
}
