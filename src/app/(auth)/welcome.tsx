import { useAuth } from '@/contexts/AuthContext';
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
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente Logo modificado para exibir a imagem do exemplo (gatinho e cachorro)
// Você precisará salvar a imagem de exemplo como 'pet_logo.png' na sua pasta assets.
function Logo() {
  return (
    <View style={styles.logoContainer}>
      <Image 
        source={require('../../../assets/pet_logo.png')} // Substitua pelo caminho da sua imagem
        style={styles.petImage}
        resizeMode="contain"
      />
    </View>
  );
}

export default function WelcomeScreen() {
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

  const handleLoginPress = () => {
    router.push('/'); // Navega para a tela de login via Expo Router
  };

  return (
    // Fundo alterado para branco, como no exemplo
    <SafeAreaView style={styles.safeArea}>
      {/* Cor da barra de status alterada para branco (dark-content) */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Removida a alça superior decorativa, pois não está no exemplo */}

        <View style={styles.content}>
          <Logo />

          {/* Título e texto descritivo adicionados/alterados para combinar com o exemplo */}
          <Text style={styles.title}>{"From Bowl to Soul\nWe've Got It All!"}</Text>
          
          <Text style={styles.subtitle}>
            {"Buy the best pet food packed\nwith health and nutrition for\nyour beloved pet"}
          </Text>

          {/* Formulário removido, pois o exemplo não possui campos de input, apenas botões */}

          <View style={styles.buttonContainer}>
            {/* Botão 'Create Account' - cores mantidas, mas com estilo do exemplo */}
            <TouchableOpacity
              style={[styles.primaryButton, submitting && styles.disabledButton]}
              activeOpacity={0.85}
              onPress={handleCadastrar} // Alterado para levar ao cadastro, como no exemplo
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Criar Conta</Text>}
            </TouchableOpacity>

            {/* Botão 'Sign In' - estilo do exemplo (borda e cor do texto) */}
            <TouchableOpacity
                onPress={handleLoginPress}
                activeOpacity={0.7}
                style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Paleta de cores baseada no exemplo
const TEAL_PRIMARY = '#12B4C4'; // Cor principal dos botões
const TEXT_DARK = '#0F1E3D'; // Cor do texto principal
const TEXT_MUTED = '#6c757d'; // Cor do texto secundário
const WHITE_BG = '#b6e0e4'; // Cor de fundo

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: WHITE_BG, // Fundo branco
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    // Ajuste de padding para centralizar o conteúdo verticalmente
    justifyContent: 'center', 
  },
  logoContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 40, // Espaçamento abaixo do logo
  },
  petImage: {
      width: 280, // Tamanho ajustado para a imagem do exemplo
      height: 280,
  },
  title: {
    fontSize: 28, // Tamanho de fonte maior, em negrito
    fontWeight: 'bold',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36, // Altura de linha para o título
  },
  subtitle: {
      fontSize: 16,
      color: TEXT_MUTED,
      textAlign: 'center',
      marginBottom: 60, // Espaçamento maior antes dos botões
      lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 56, // Botão mais alto
    backgroundColor: TEAL_PRIMARY, // Cor de fundo do botão primário
    borderRadius: 28, // Borda mais arredondada
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // Espaçamento entre botões
    elevation: 3, // Sombra leve para Android
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18, // Fonte maior
    fontWeight: '600',
  },
  secondaryButton: {
      width: '100%',
      height: 56,
      backgroundColor: WHITE_BG,
      borderColor: TEAL_PRIMARY, // Cor da borda
      borderWidth: 2, // Espessura da borda
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
  },
  secondaryButtonText: {
    color: TEAL_PRIMARY, // Cor do texto igual à primária
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});