import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackHeader } from '@/app/components/BackHeader';
import { COLORS, SPACING } from '@/theme';

interface TermsSection {
  title: string;
  paragraphs: string[];
}

const LAST_UPDATED = '04 de novembro de 2026';

const SECTIONS: TermsSection[] = [
  {
    title: '1. Objeto',
    paragraphs: [
      'Estes Termos de Uso e esta Política de Privacidade regulam o uso do aplicativo RoadVet e o tratamento dos dados pessoais nele realizados, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD), Lei nº 13.709/2018.',
      'Ao marcar a caixa de aceite no cadastro, você declara que leu, compreendeu e concorda com as condições aqui descritas.',
    ],
  },
  {
    title: '2. Dados pessoais do usuário',
    paragraphs: [
      'Para criar e manter sua conta, coletamos nome completo, número de inscrição no CRMV, e-mail, telefone e senha. A senha é armazenada de forma criptografada e nunca é exibida em texto aberto.',
      'Esses dados são usados exclusivamente para identificar você, autenticar o acesso, sincronizar suas informações entre dispositivos e manter contato sobre a conta.',
    ],
  },
  {
    title: '3. Dados de tutores e animais',
    paragraphs: [
      'O aplicativo permite cadastrar dados de tutores, como nome, CPF, data de nascimento, endereço, e-mail e telefones, além de informações dos animais, prontuários e anexos clínicos.',
      'Em relação a esses dados, você, profissional veterinário, atua como controlador, sendo responsável por obter as autorizações necessárias e por informar os tutores sobre o tratamento. O RoadVet atua como operador, tratando esses dados somente para viabilizar o armazenamento, a sincronização e a consulta dentro do aplicativo.',
    ],
  },
  {
    title: '4. Finalidade e bases legais',
    paragraphs: [
      'Os dados são tratados para a execução do serviço contratado, o cumprimento de obrigações legais e regulatórias aplicáveis à atividade veterinária, o exercício regular de direitos e, quando necessário, mediante o seu consentimento.',
      'Não utilizamos os dados para finalidades incompatíveis com as informadas nestes termos, nem os comercializamos.',
    ],
  },
  {
    title: '5. Compartilhamento',
    paragraphs: [
      'Os dados podem ser compartilhados apenas com prestadores de serviços essenciais ao funcionamento do aplicativo, como hospedagem e infraestrutura, que se obrigam a manter o mesmo nível de proteção, ou com autoridades públicas, quando houver determinação legal ou judicial.',
    ],
  },
  {
    title: '6. Armazenamento e segurança',
    paragraphs: [
      'Os dados ficam armazenados no seu dispositivo e em servidores protegidos, com transmissão por conexão criptografada. Adotamos medidas técnicas e administrativas para protegê-los contra acessos não autorizados, perda, alteração ou divulgação indevida.',
      'Os dados são mantidos enquanto a conta estiver ativa ou pelo prazo exigido pela legislação aplicável, sendo eliminados ou anonimizados após esse período.',
    ],
  },
  {
    title: '7. Direitos do titular',
    paragraphs: [
      'Nos termos da LGPD, você pode solicitar a confirmação da existência de tratamento, o acesso aos dados, a correção de dados incompletos ou desatualizados, a anonimização, o bloqueio ou a eliminação de dados desnecessários, a portabilidade, informações sobre compartilhamento e a revogação do consentimento.',
      'A revogação do consentimento ou a exclusão da conta pode impedir a continuidade do uso do aplicativo.',
    ],
  },
  {
    title: '8. Responsabilidades do usuário',
    paragraphs: [
      'Você se compromete a fornecer informações verdadeiras, manter sua senha em sigilo e utilizar o aplicativo de acordo com a legislação vigente e com o Código de Ética do Médico-Veterinário.',
    ],
  },
  {
    title: '9. Alterações',
    paragraphs: [
      'Estes termos podem ser atualizados a qualquer tempo. Alterações relevantes serão comunicadas pelo aplicativo e, quando exigido, um novo aceite será solicitado.',
    ],
  },
  {
    title: '10. Contato',
    paragraphs: [
      'Dúvidas, solicitações ou reclamações sobre o tratamento de dados pessoais podem ser encaminhadas pelos canais de atendimento do RoadVet.',
    ],
  },
];

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <BackHeader title="Termos de Uso e Privacidade" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Última atualização: {LAST_UPDATED}</Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.paragraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: SPACING.gutter,
    paddingTop: SPACING.section,
    paddingBottom: SPACING.block,
  },
  updated: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  section: {
    marginTop: SPACING.section,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: 'justify',
  },
});
