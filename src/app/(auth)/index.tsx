import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

function Logo() {
  return (
    <Image source={require('../../../assets/logo.png')} />
  );
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      setError('Informe email e senha.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await login(email.trim(), senha);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace('/(tabs)/home');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCadastrar = () => {
    router.push('/register')
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

        <View style={styles.content}>
          <Logo />

          <Text style={styles.title}>Login</Text>

          <View style={styles.form}>
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
              placeholder="Senha"
              placeholderTextColor="#8A8F98"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.loginButton, submitting && styles.disabledButton]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCadastrar} activeOpacity={0.7}>
              <Text style={styles.cadastrar}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 48,
  },
  logoBadge: {
    width: 96,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 56,
    position: 'absolute',
  },
  logoDog: {
    fontSize: 26,
    position: 'absolute',
    top: -8,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: NAVY,
    marginTop: 4,
    marginBottom: 56,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 22,
    color: '#3E4653',
    paddingTop: 20,
    marginBottom: 28,
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
    marginBottom: 18,
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
    marginTop: 20,
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
