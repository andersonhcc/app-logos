import { Stack } from 'expo-router';
import { Linking, Pressable, ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';

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
  return (
    <>
      <Stack.Screen options={{ title: 'Privacidade' }} />
      <ScrollView
        className="flex-1 bg-bg-base"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 24, paddingBottom: 48, gap: 24 }}>
        <View className="gap-2">
          <Text variant="title" className="text-fg">
            Política de Privacidade
          </Text>
          <Text variant="caption" className="text-fg-tertiary">
            Atualizada em 28 de junho de 2026
          </Text>
        </View>

        <Section title="Resumo">
          O Logos AI não exige conta, não exibe anúncios e não realiza rastreamento. Seus
          planos e progresso ficam armazenados no dispositivo. Alguns dados são processados
          remotamente somente para gerar o conteúdo solicitado.
        </Section>

        <Section title="Dados no dispositivo">
          Tema escolhido, plano, progresso, preferências, passagens, reflexões e orações são
          mantidos localmente. Esses dados podem ser removidos ao desinstalar o aplicativo ou
          apagar seus dados nas configurações do sistema.
        </Section>

        <Section title="Geração com inteligência artificial">
          Para criar planos, reflexões e orações, enviamos ao Supabase e à OpenAI o tema
          selecionado, a referência e o texto da passagem, além do dia e da duração do plano.
          Não enviamos nome, e-mail, contatos, localização ou identificadores de publicidade.
          Os provedores podem manter registros técnicos, como endereço IP e logs de segurança,
          conforme suas próprias políticas.
        </Section>

        <Section title="Denúncias de conteúdo">
          Quando você sinaliza um conteúdo, a reflexão, a oração e o contexto da leitura são
          enviados e armazenados para análise. Esses registros são usados exclusivamente para
          segurança e melhoria da qualidade, pelo tempo necessário à revisão.
        </Section>

        <Section title="Notificações e compartilhamento">
          Lembretes são agendados localmente após sua autorização. O compartilhamento de texto
          ou imagem ocorre somente quando você inicia a ação e utiliza os recursos do sistema.
        </Section>

        <Section title="Uso e compartilhamento">
          Usamos os dados apenas para operar o app, gerar o conteúdo solicitado, prevenir abuso
          e revisar denúncias. Não vendemos dados pessoais e não os utilizamos para publicidade.
        </Section>

        <Section title="Contato">
          Dúvidas e solicitações de privacidade podem ser enviadas pelo contato de suporte
          informado na página oficial do Logos AI na loja.
        </Section>

        {PRIVACY_EMAIL && (
          <Pressable
            accessibilityRole="link"
            hitSlop={12}
            onPress={() => Linking.openURL(`mailto:${PRIVACY_EMAIL}`)}
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
