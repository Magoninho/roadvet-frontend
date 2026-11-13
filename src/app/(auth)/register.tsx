import { useAuth } from '@/contexts/AuthContext';
import { isValidEmail, isValidPhone, maskPhone, sanitizeEmail } from '@/utils/validation';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Logo() {
  return (
    <Image 
      source={require('../../../assets/logo.png')} 
      style={[styles.logo, { width: 120, height: 120 }]}  
    />
  );
}

export default function CadastroScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [crmv, setCrmv] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      setError('Preencha nome, email e senha.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Informe um email válido.');
      return;
    }
    if (telefone.trim() && !isValidPhone(telefone)) {
      setError('Informe um telefone válido com DDD.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!aceitouTermos) {
      setError('É necessário aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await register({
        nome: nome.trim(),
        crmv: crmv.trim() || null,
        email: email.trim(),
        telefone: telefone.trim() || null,
        senha,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace('/(tabs)/home');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTermos = () => {
    setAceitouTermos((aceito) => !aceito);
    if (error) setError(null);
  };

  const handleAbrirTermos = () => {
    router.push('/(auth)/terms');
  };

  const handleVoltarLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFE6E6" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        automaticOffset
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
                onChangeText={(text) => setEmail(sanitizeEmail(text))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              <TextInput
                style={styles.input}
                placeholder="Telefone (85) 99999-9999"
                placeholderTextColor="#8A8F98"
                value={telefone}
                onChangeText={(text) => setTelefone(maskPhone(text))}
                maxLength={15}
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

              <View style={styles.termsRow}>
                <Pressable
                  onPress={toggleTermos}
                  hitSlop={8}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: aceitouTermos }}
                  accessibilityLabel="Aceito os Termos de Uso e a Política de Privacidade"
                >
                  <Icon
                    name={aceitouTermos ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={24}
                    color={aceitouTermos ? CYAN : '#5F6B7A'}
                  />
                </Pressable>
                <Text style={styles.termsText}>
                  <Text onPress={toggleTermos}>Li e concordo com os </Text>
                  <Text style={styles.termsLink} onPress={handleAbrirTermos} accessibilityRole="link">
                    Termos de Uso e a Política de Privacidade
                  </Text>
                  <Text onPress={toggleTermos}>, em conformidade com a LGPD (Lei nº 13.709/2018).</Text>
                </Text>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.loginButton, submitting && styles.disabledButton]}
                activeOpacity={0.85}
                onPress={handleCadastrar}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Cadastrar</Text>
                )}
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
  termsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#3E4653',
  },
  termsLink: {
    color: CYAN,
    fontWeight: '700',
  },
  errorText: {
    color: '#D64545',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
