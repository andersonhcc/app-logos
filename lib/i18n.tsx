import { getLocales } from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';
import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react';

import { PREF_KEYS, storage, useStoredLocale } from './preferences';

export const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const translations = {
  en: {
    common: { continue: 'Continue', cancel: 'Cancel', change: 'Change', save: 'Save', back: 'Back' },
    tabs: { today: 'Today', explore: 'Explore' },
    onboarding: {
      tagline: 'A daily journey through the Word.',
      intro: 'Choose what is on your heart and receive a reading plan with Scripture, reflection, and prayer — made for you.',
      start: 'Get started',
      appearanceEyebrow: 'Make it yours', appearanceTitle: 'Choose your appearance', appearanceBody: 'Select the theme that feels most comfortable. You can change it later.', systemTheme: 'Your device is currently using this theme',
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
    plans: {
      create: 'Create plan', createAnother: 'Create another plan', change: 'Change plan', myPlans: 'My plans',
      changeTitle: 'Change your current plan?', changeBody: 'Your current progress will be saved and the plan will be marked as abandoned.',
      progress: '%{completed} of %{total} days completed',
      status: { active: 'Active', completed: 'Completed', abandoned: 'Abandoned' },
      viewDays: 'View days and reflections', planDetails: 'Plan details', dayDetails: 'Day details', day: 'Day %{day}',
      dayCompleted: 'Completed', dayNotCompleted: 'Not completed', contentUnavailable: 'Reading unavailable',
      notGenerated: 'This content was not generated for this day.', notFound: 'Plan not found.',
    },
    explore: { subtitle: 'Curated collections and plans.', plans: '%{count} readings', search: 'Search verses, books…', comingSoon: 'More collections coming soon.' },
    collections: { psalms: 'Psalms for the morning', john: 'Gospel of John', paul: "Paul's letters", proverbs: 'Daily Proverbs' },
    settings: {
      title: 'Settings', language: 'Language', languageBody: 'New plans will be created in this language. Existing plans keep their original language.', english: 'English', portuguese: 'Português (Brasil)', privacy: 'Privacy policy',
      reminder: 'Daily reminder', reminderEnabled: 'Enabled', reminderDisabled: 'Disabled', reminderTime: 'Time', enableReminder: 'Enable reminder', disableReminder: 'Disable reminder',
      appearance: 'Appearance', appearanceBody: 'Choose a theme or follow your device settings.', theme: { system: 'System', light: 'Light', dark: 'Dark' },
      widget: 'Home Screen Widget', widgetBody: 'Add your daily verse and plan progress to your Home Screen.',
      widgetInstructionsTitle: 'Add Logos AI to your Home Screen',
      widgetInstructions: '1. Touch and hold your Home Screen.\n2. Tap +.\n3. Search for Logos AI.\n4. Choose a widget size and tap Add Widget.',
    },
    notification: {
      channel: 'Daily reminder', title: "Today's reading", body: 'Set aside a moment with the Word.', requesting: 'Requesting permission…',
      permissionTitle: 'Notification permission', continueWithout: 'Continue without reminder', openSettings: 'Open settings',
      permission: { denied: 'Permission was denied. You can enable the reminder later in Settings.', blocked: 'Notifications are blocked. Open system settings to enable them.', unavailable: 'Notifications require a physical device.' },
    },
    streak: {
      dayLabel: 'day streak', daysLabel: 'day streak', keepGoing: 'Come back tomorrow to keep your streak alive.',
      milestone3: 'Three days walking in the Word!', milestone7: 'A full week with the Word!',
      milestone14: 'Two weeks of faithfulness!', milestone30: 'Thirty days! The Word became a habit.',
    },
    share: { devotional: 'daily devotional', dialog: 'Share reflection', unavailable: 'Sharing is unavailable on this device' },
    bible: { loadError: 'The Bible data is unavailable. Run `npm run fetch:bible` and reopen the app.' },
    privacy: { title: 'Privacy Policy' },
  },
  'pt-BR': {
    common: { continue: 'Continuar', cancel: 'Cancelar', change: 'Trocar', save: 'Salvar', back: 'Voltar' },
    tabs: { today: 'Hoje', explore: 'Explorar' },
    onboarding: {
      tagline: 'Um caminho diário pela Palavra.', intro: 'Escolha um tema do seu coração e receba um plano de leitura com versículos, reflexão e oração — feito pra você.', start: 'Começar',
      appearanceEyebrow: 'Do seu jeito', appearanceTitle: 'Escolha a aparência', appearanceBody: 'Selecione o tema mais confortável para você. Isso pode ser alterado depois.', systemTheme: 'Seu dispositivo está usando este tema',
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
    plans: {
      create: 'Criar plano', createAnother: 'Criar outro plano', change: 'Trocar plano', myPlans: 'Meus planos',
      changeTitle: 'Trocar seu plano atual?', changeBody: 'Seu progresso atual será preservado e o plano será marcado como abandonado.',
      progress: '%{completed} de %{total} dias concluídos',
      status: { active: 'Ativo', completed: 'Concluído', abandoned: 'Abandonado' },
      viewDays: 'Ver dias e reflexões', planDetails: 'Detalhes do plano', dayDetails: 'Detalhes do dia', day: 'Dia %{day}',
      dayCompleted: 'Concluído', dayNotCompleted: 'Não concluído', contentUnavailable: 'Leitura indisponível',
      notGenerated: 'Este conteúdo não foi gerado para este dia.', notFound: 'Plano não encontrado.',
    },
    explore: { subtitle: 'Coleções e planos curados.', plans: '%{count} leituras', search: 'Buscar versículos, livros…', comingSoon: 'Mais coleções em breve.' },
    collections: { psalms: 'Salmos para a manhã', john: 'Evangelho de João', paul: 'Cartas de Paulo', proverbs: 'Provérbios diários' },
    settings: {
      title: 'Configurações', language: 'Idioma', languageBody: 'Novos planos serão criados neste idioma. Planos existentes mantêm o idioma original.', english: 'English', portuguese: 'Português (Brasil)', privacy: 'Política de Privacidade',
      reminder: 'Lembrete diário', reminderEnabled: 'Ativado', reminderDisabled: 'Desativado', reminderTime: 'Horário', enableReminder: 'Ativar lembrete', disableReminder: 'Desativar lembrete',
      appearance: 'Aparência', appearanceBody: 'Escolha um tema ou acompanhe os ajustes do dispositivo.', theme: { system: 'Sistema', light: 'Claro', dark: 'Escuro' },
      widget: 'Widget na Tela de Início', widgetBody: 'Adicione o versículo do dia e o progresso do plano à Tela de Início.',
      widgetInstructionsTitle: 'Adicione o Logos AI à Tela de Início',
      widgetInstructions: '1. Toque e segure na Tela de Início.\n2. Toque em +.\n3. Busque por Logos AI.\n4. Escolha um tamanho e toque em Adicionar Widget.',
    },
    notification: {
      channel: 'Lembrete diário', title: 'Sua leitura de hoje', body: 'Reserve um momento com a Palavra.', requesting: 'Solicitando permissão…',
      permissionTitle: 'Permissão de notificações', continueWithout: 'Continuar sem lembrete', openSettings: 'Abrir configurações',
      permission: { denied: 'A permissão foi negada. Você pode ativar o lembrete depois nas Configurações.', blocked: 'As notificações estão bloqueadas. Abra as configurações do sistema para ativá-las.', unavailable: 'As notificações exigem um dispositivo físico.' },
    },
    streak: {
      dayLabel: 'dia seguido', daysLabel: 'dias seguidos', keepGoing: 'Volte amanhã para manter sua sequência viva.',
      milestone3: 'Três dias caminhando na Palavra!', milestone7: 'Uma semana inteira com a Palavra!',
      milestone14: 'Duas semanas de constância!', milestone30: 'Trinta dias! A Palavra virou hábito.',
    },
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

export function translate(key: string, options?: TranslateOptions, locale = getStoredLocale()) {
  return i18n.t(key, { ...options, locale });
}

type LocaleContextValue = { locale: SupportedLocale; setLocale: (locale: SupportedLocale) => void; t: typeof translate };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: PropsWithChildren) {
  const storedLocale = useStoredLocale();
  const locale = storedLocale === 'pt-BR' || storedLocale === 'en' ? storedLocale : detectLocale();
  i18n.locale = locale;
  const t = useCallback((key: string, options?: TranslateOptions) => translate(key, options, locale), [locale]);
  const value = useMemo(() => ({
    locale,
    setLocale(next: SupportedLocale) {
      storage.set(PREF_KEYS.locale, next);
      i18n.locale = next;
    },
    t,
  }), [locale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useI18n must be used inside LocaleProvider');
  return value;
}
