import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';


function Logo() {
  return (
    <Image 
      source={require('../../../assets/logo.png')} 
      style={{ width: 120, height: 120, resizeMode: 'contain' }}  
    />
  );
}


// A largura acompanha a tela (descontado o padding lateral do conteúdo, limitada a 500) e a altura
// segue a proporção do arquivo (1352x875), evitando overflow lateral em celulares.
const DOG_MAX_WIDTH = 500;
const DOG_ASPECT_RATIO = 875 / 1352;

function Dog() {
  const { width: windowWidth } = useWindowDimensions();
  const dogWidth = Math.min(windowWidth - CONTENT_PADDING * 2, DOG_MAX_WIDTH);

  return (
    <View pointerEvents="none">
      <Image 
        source={require('../../../assets/brownDog.png')} 
        style={[styles.logoImage, { width: dogWidth, height: dogWidth * DOG_ASPECT_RATIO }]}  
      />
    </View>
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
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFE6E6" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        automaticOffset
      >
        {/* Top drag handle */}
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
          <Dog/>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const TEAL_BG = '#b6e0e4';
const NAVY = '#0F1E3D';
const CYAN = '#12B4C4';
const CONTENT_PADDING = 28;

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
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 24, // Ajustado levemente para dar espaço à logo no topo
    zIndex: 1,
  },
  logoImage: {
    // A caixa agora tem a altura exata da imagem; antes, a faixa transparente de ~88px acima dela
    // compensava parte dos -100 originais.
    marginTop: -12,
    marginBottom: 10, // Espaço entre a logo e o texto "Login"
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: '#3E4653',
    paddingTop: 10,
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
  }
});