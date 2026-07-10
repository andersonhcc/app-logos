import { Stack } from 'expo-router';
import { Linking, Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useAnalytics } from '@/lib/analytics';
import { AnalyticsEvents } from '@/lib/analytics-events';
import { useI18n } from '@/lib/i18n';

const PRIVACY_EMAIL = process.env.EXPO_PUBLIC_PRIVACY_EMAIL?.trim();

type SectionProps = {
  title: string;
  children: string;
};

function Section({ title, children }: SectionProps) {
  return (
    <View className="gap-2">
      <Text variant="subtitle" className="text-fg">
        {title}
      </Text>
      <Text variant="bodySmall" className="text-fg-secondary">
        {children}
      </Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const { track } = useAnalytics();
  const { locale, t } = useI18n();
  const en = locale === 'en';
  return (
    <>
      <Stack.Screen options={{ title: t('privacy.title') }} />
      <ScrollView
        className="flex-1 bg-bg-base"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 24, paddingBottom: 48, gap: 24 }}>
        <View className="gap-2">
          <Text variant="title" className="text-fg">
            {t('privacy.title')}
          </Text>
          <Text variant="caption" className="text-fg-tertiary">
            {en ? 'Updated July 10, 2026' : 'Atualizada em 10 de julho de 2026'}
          </Text>
        </View>

        <Section title={en ? 'Summary' : 'Resumo'}>
          {en ? 'Logos AI does not require an account or display ads. Your plans and progress are stored on your device. Some data is processed remotely only to generate the content you request, and we use limited anonymous product analytics to understand app usage and improve the experience.' : 'O Logos AI não exige conta nem exibe anúncios. Seus planos e progresso ficam armazenados no dispositivo. Alguns dados são processados remotamente somente para gerar o conteúdo solicitado, e usamos analytics anônimo limitado para entender o uso do app e melhorar a experiência.'}
        </Section>

        <Section title={en ? 'Data on your device' : 'Dados no dispositivo'}>
          {en ? 'Your selected theme, plan, progress, preferences, passages, reflections, and prayers are stored locally. You can remove this data by uninstalling the app or clearing its data in system settings.' : 'Tema escolhido, plano, progresso, preferências, passagens, reflexões e orações são mantidos localmente. Esses dados podem ser removidos ao desinstalar o aplicativo ou apagar seus dados nas configurações do sistema.'}
        </Section>

        <Section title={en ? 'AI-generated content' : 'Geração com inteligência artificial'}>
          {en ? 'To create plans, reflections, and prayers, we send Supabase and OpenAI the selected theme, passage reference and text, plan day, duration, and language. We do not send your name, email, contacts, location, or advertising identifiers. Providers may retain technical records under their own policies.' : 'Para criar planos, reflexões e orações, enviamos ao Supabase e à OpenAI o tema selecionado, a referência e o texto da passagem, além do dia, da duração e do idioma do plano. Não enviamos nome, e-mail, contatos, localização ou identificadores de publicidade. Os provedores podem manter registros técnicos conforme suas próprias políticas.'}
        </Section>

        <Section title={en ? 'Anonymous product analytics' : 'Analytics anônimo de produto'}>
          {en ? 'We use Mixpanel to collect minimal anonymous product analytics, such as screen views, onboarding progress, plan creation, reading completion, sharing actions, search query length, result count, language, platform, app version, theme preference, and whether onboarding was completed. We do not send Bible text, reflections, prayers, literal search terms, name, email, precise location, contacts, or advertising identifiers. Analytics uses an anonymous app-generated identifier from the analytics provider.' : 'Usamos Mixpanel para coletar analytics anônimo mínimo de produto, como telas acessadas, progresso do onboarding, criação de plano, conclusão de leitura, ações de compartilhamento, tamanho da busca, quantidade de resultados, idioma, plataforma, versão do app, preferência de tema e se o onboarding foi concluído. Não enviamos texto bíblico, reflexões, orações, termos literais de busca, nome, e-mail, localização precisa, contatos ou identificadores de publicidade. O analytics usa um identificador anônimo gerado pelo provedor de analytics para o app.'}
        </Section>

        <Section title={en ? 'Content reports' : 'Denúncias de conteúdo'}>
          {en ? 'When you report content, the reflection, prayer, and reading context are sent to Supabase and stored for safety and quality review for no more than 180 days, after which they are automatically deleted.' : 'Quando você sinaliza um conteúdo, a reflexão, a oração e o contexto da leitura são enviados ao Supabase e armazenados para análise de segurança e qualidade por no máximo 180 dias, quando são excluídos automaticamente.'}
        </Section>

        <Section title={en ? 'Notifications and sharing' : 'Notificações e compartilhamento'}>
          {en ? 'Reminders are scheduled locally after you grant permission. Text or image sharing occurs only when you initiate it using system features.' : 'Lembretes são agendados localmente após sua autorização. O compartilhamento de texto ou imagem ocorre somente quando você inicia a ação e utiliza os recursos do sistema.'}
        </Section>

        <Section title={en ? 'Use and disclosure' : 'Uso e compartilhamento'}>
          {en ? 'We use data only to operate the app, generate requested content, prevent abuse, and review reports. We do not sell personal data or use it for advertising.' : 'Usamos os dados apenas para operar o app, gerar o conteúdo solicitado, prevenir abuso e revisar denúncias. Não vendemos dados pessoais e não os utilizamos para publicidade.'}
        </Section>

        <Section title={en ? 'Your choices and deletion' : 'Suas escolhas e exclusão'}>
          {en ? 'Remote processing is explained before its first use. You may decline it and not create a personalized plan. You can remove local app data and reset the anonymous analytics identifier by clearing the app data in system settings or uninstalling the app. To request early deletion of a content report, contact support and provide the approximate submission date and reading reference.' : 'O processamento remoto é informado antes do primeiro uso. Você pode recusá-lo e não criar um plano personalizado. Você pode remover dados locais do app e redefinir o identificador anônimo de analytics ao apagar os dados do app nas configurações do sistema ou desinstalá-lo. Para solicitar a exclusão antecipada de uma denúncia, contate o suporte e informe a data aproximada e a referência da leitura.'}
        </Section>

        <Section title={en ? 'Contact' : 'Contato'}>
          {en ? 'Privacy questions and requests can be sent through the support contact listed on the official Logos AI store page.' : 'Dúvidas e solicitações de privacidade podem ser enviadas pelo contato de suporte informado na página oficial do Logos AI na loja.'}
        </Section>

        {PRIVACY_EMAIL && (
          <Pressable
            accessibilityRole="link"
            hitSlop={12}
            onPress={() => {
              track(AnalyticsEvents.EXTERNAL_LINK_OPENED, { link_type: 'privacy_email' });
              void Linking.openURL(`mailto:${PRIVACY_EMAIL}`);
            }}
            className="self-start py-2">
            <Text variant="bodySmall" className="text-brand">
              {PRIVACY_EMAIL}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}
