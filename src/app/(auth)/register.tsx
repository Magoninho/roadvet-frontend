import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Logo() {
  return (
    <Image source={require('../../../assets/logo.png')} />
  );
}

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [crmv, setCrmv] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastrar = () => {
    if (senha !== confirmarSenha) {
      // TODO: exibir mensagem de erro (senhas não coincidem)
      return;
    }
    // Wire this up to your auth/cadastro call
    console.log('Cadastro pressed', { nome, crmv, email, telefone, senha });
    router.push('/home');
  };

  const handleVoltarLogin = () => {
    navigation?.navigate?.('Login') ?? router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFE6E6" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top drag handle, purely decorative to match the mock */}
        <View style={styles.handle} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Logo />

            <Text style={styles.title}>Cadastro</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#8A8F98"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="CRMV"
                placeholderTextColor="#8A8F98"
                value={crmv}
                onChangeText={setCrmv}
                autoCapitalize="characters"
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8A8F98"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor="#8A8F98"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#8A8F98"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="#8A8F98"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleCadastrar}
              />

              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.85}
                onPress={handleCadastrar}
              >
                <Text style={styles.loginButtonText}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleVoltarLogin} activeOpacity={0.7}>
                <Text style={styles.cadastrar}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const TEAL_BG = '#b6e0e4';
const NAVY = '#0F1E3D';
const CYAN = '#12B4C4';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: TEAL_BG,
  },
  flex: {
    flex: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9AC7C7',
    marginTop: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    color: '#3E4653',
    paddingTop: 12,
    marginBottom: 24,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 22,
    fontSize: 16,
    color: NAVY,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  loginButton: {
    width: '100%',
    height: 52,
    backgroundColor: CYAN,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  cadastrar: {
    color: CYAN,
    fontSize: 15,
    fontWeight: '700',
  },
});
