import { getLocales } from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { PREF_KEYS, storage } from './preferences';

export const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const translations = {
  en: {
    common: { continue: 'Continue', cancel: 'Cancel', change: 'Change' },
    tabs: { today: 'Today', explore: 'Explore' },
    onboarding: {
      tagline: 'A daily journey through the Word.',
      intro: 'Choose what is on your heart and receive a reading plan with Scripture, reflection, and prayer — made for you.',
      start: 'Get started',
      themeEyebrow: 'Your journey', themeTitle: 'What is on your heart today?',
      durationEyebrow: 'Choose your pace', durationTitle: 'How many days?', durationBody: 'You can pause or restart whenever you want.',
      duration7: 'A gentle start.', duration14: 'Time to build a habit.', duration30: 'A complete immersion.', days: '%{count} days',
      notificationEyebrow: 'Last step', notificationTitle: 'Daily reminder?', notificationBody: 'Choose a time for your reading. You can change it later.',
      morning: 'Morning', lunch: 'Lunch', evening: 'Evening', enableReminder: 'Enable reminder', notNow: 'Not now',
      preparing: 'Preparing your journey', prepared: 'Your journey is ready', wait: 'This may take a moment.', enter: 'Open my plan',
      stepBible: 'Indexing the Bible on this device…', stepPlan: 'Creating your reading plan…', stepContent: 'Preparing the first reflection…',
    },
    themes: {
      anxiety: ['Anxiety', 'Peace in the middle of uncertainty.'], gratitude: ['Gratitude', 'A heart that recognizes.'],
      forgiveness: ['Forgiveness', 'Release the weight.'], faith: ['Faith', 'Trust in the unseen.'],
      purpose: ['Purpose', 'Discover your calling.'], relationships: ['Relationships', 'Love as Christ loved.'],
      hope: ['Hope', 'Light on the horizon.'], peace: ['Peace', 'Inner stillness.'],
    },
    today: {
      noPlan: 'No active plan', createPlan: 'Create a reading plan to begin.', day: 'Day %{day} of %{total}', reading: "Today's reading",
      reflection: 'Reflection', prayer: 'Prayer', generatingReflection: 'Generating a personalized reflection…', generatingPrayer: 'Generating prayer…',
      generationFailed: 'Unable to generate right now. %{error}', report: 'Report content', reported: 'Content reported', markRead: 'Mark as read', share: 'Share',
      dayDone: 'You completed this day. Come back tomorrow for the next reading.', planDone: 'Plan completed.',
      shareError: 'Unable to share', thanks: 'Thank you', reportSuccess: 'The content was submitted for review.', submitError: 'Unable to submit', tryAgain: 'Try again in a moment.',
      reportTitle: 'Report this content?', reportBody: 'This helps us review inappropriate or incorrect content.', reportAction: 'Report',
    },
    explore: { subtitle: 'Curated collections and plans.', plans: '%{count} readings', search: 'Search verses, books…', comingSoon: 'More collections coming soon.' },
    collections: { psalms: 'Psalms for the morning', john: 'Gospel of John', paul: "Paul's letters", proverbs: 'Daily Proverbs' },
    settings: { title: 'Settings', language: 'Language', languageBody: 'New plans will be created in this language. Existing plans keep their original language.', english: 'English', portuguese: 'Português (Brasil)', privacy: 'Privacy policy' },
    notification: { channel: 'Daily reminder', title: "Today's reading", body: 'Set aside a moment with the Word.' },
    share: { devotional: 'daily devotional', dialog: 'Share reflection', unavailable: 'Sharing is unavailable on this device' },
    bible: { loadError: 'The Bible data is unavailable. Run `npm run fetch:bible` and reopen the app.' },
    privacy: { title: 'Privacy Policy' },
  },
  'pt-BR': {
    common: { continue: 'Continuar', cancel: 'Cancelar', change: 'Trocar' },
    tabs: { today: 'Hoje', explore: 'Explorar' },
    onboarding: {
      tagline: 'Um caminho diário pela Palavra.', intro: 'Escolha um tema do seu coração e receba um plano de leitura com versículos, reflexão e oração — feito pra você.', start: 'Começar',
      themeEyebrow: 'Sua jornada', themeTitle: 'O que está no seu coração hoje?', durationEyebrow: 'Escolha seu ritmo', durationTitle: 'Quantos dias?', durationBody: 'Você pode pausar ou recomeçar quando quiser.',
      duration7: 'Um começo leve.', duration14: 'Tempo pra formar hábito.', duration30: 'Imersão completa.', days: '%{count} dias',
      notificationEyebrow: 'Último passo', notificationTitle: 'Lembrete diário?', notificationBody: 'Escolha um horário pra receber sua leitura. Você pode mudar depois.',
      morning: 'Manhã', lunch: 'Almoço', evening: 'Noite', enableReminder: 'Ativar lembrete', notNow: 'Agora não',
      preparing: 'Preparando sua jornada', prepared: 'Sua jornada está pronta', wait: 'Isso pode levar um instante.', enter: 'Entrar no meu plano',
      stepBible: 'Indexando a Bíblia no dispositivo…', stepPlan: 'Criando seu plano de leitura…', stepContent: 'Preparando a primeira reflexão…',
    },
    themes: {
      anxiety: ['Ansiedade', 'Paz em meio à inquietação.'], gratitude: ['Gratidão', 'Coração que reconhece.'], forgiveness: ['Perdão', 'Soltar o peso.'],
      faith: ['Fé', 'Confiança no invisível.'], purpose: ['Propósito', 'Descobrir o chamado.'], relationships: ['Relacionamentos', 'Amar como Cristo amou.'],
      hope: ['Esperança', 'Luz no horizonte.'], peace: ['Paz', 'Quietude interior.'],
    },
    today: {
      noPlan: 'Nenhum plano ativo', createPlan: 'Crie um plano de leitura pra começar.', day: 'Dia %{day} de %{total}', reading: 'Leitura de hoje', reflection: 'Reflexão', prayer: 'Oração',
      generatingReflection: 'Gerando reflexão personalizada…', generatingPrayer: 'Gerando oração…', generationFailed: 'Não foi possível gerar agora. %{error}', report: 'Sinalizar conteúdo', reported: 'Conteúdo sinalizado',
      markRead: 'Marcar como lido', share: 'Compartilhar', dayDone: 'Você concluiu este dia. Volte amanhã pra próxima leitura.', planDone: 'Plano concluído.', shareError: 'Erro ao compartilhar',
      thanks: 'Obrigado', reportSuccess: 'O conteúdo foi sinalizado para revisão.', submitError: 'Não foi possível enviar', tryAgain: 'Tente novamente em alguns instantes.',
      reportTitle: 'Sinalizar este conteúdo?', reportBody: 'Isso nos ajuda a revisar conteúdos inadequados ou incorretos.', reportAction: 'Sinalizar',
    },
    explore: { subtitle: 'Coleções e planos curados.', plans: '%{count} leituras', search: 'Buscar versículos, livros…', comingSoon: 'Mais coleções em breve.' },
    collections: { psalms: 'Salmos para a manhã', john: 'Evangelho de João', paul: 'Cartas de Paulo', proverbs: 'Provérbios diários' },
    settings: { title: 'Configurações', language: 'Idioma', languageBody: 'Novos planos serão criados neste idioma. Planos existentes mantêm o idioma original.', english: 'English', portuguese: 'Português (Brasil)', privacy: 'Política de Privacidade' },
    notification: { channel: 'Lembrete diário', title: 'Sua leitura de hoje', body: 'Reserve um momento com a Palavra.' },
    share: { devotional: 'devocional diário', dialog: 'Compartilhar reflexão', unavailable: 'Compartilhamento indisponível neste dispositivo' },
    bible: { loadError: 'Os dados da Bíblia não estão disponíveis. Rode `npm run fetch:bible` e reabra o app.' },
    privacy: { title: 'Política de Privacidade' },
  },
};

const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export function normalizeLocale(value?: string | null): SupportedLocale {
  return value?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

export function detectLocale(): SupportedLocale {
  return normalizeLocale(getLocales()[0]?.languageTag ?? getLocales()[0]?.languageCode);
}

export function getStoredLocale(): SupportedLocale {
  const stored = storage.getString(PREF_KEYS.locale);
  return stored === 'pt-BR' || stored === 'en' ? stored : detectLocale();
}

export function translate(key: string, options?: TranslateOptions) {
  return i18n.t(key, options);
}

type LocaleContextValue = { locale: SupportedLocale; setLocale: (locale: SupportedLocale) => void; t: typeof translate };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, updateLocale] = useState<SupportedLocale>(getStoredLocale);
  i18n.locale = locale;
  const value = useMemo(() => ({
    locale,
    setLocale(next: SupportedLocale) { storage.set(PREF_KEYS.locale, next); i18n.locale = next; updateLocale(next); },
    t: translate,
  }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useI18n must be used inside LocaleProvider');
  return value;
}
