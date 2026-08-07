import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../../ui/theme';
import { authSession } from '../../../services/auth/session';

function Logo() {
  return <Image source={require('../../../../assets/logo.png')} />;
}

export function LoginContainer() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    authSession.setSession({
      token: 'dummy-jwt-token',
      user: { id: '1', email: usuario, name: usuario || 'Veterinário', role: 'vet' },
    });
    router.push('/home');
  };

  const handleCadastrar = () => {
    // Navigate to registration when available
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#BFE6E6" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.handle} />

        <View style={styles.content}>
          <Logo />

          <Text style={styles.title}>Login</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#8A8F98"
              value={usuario}
              onChangeText={setUsuario}
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

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
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

const TEAL_BG = '#BFE6E6';
const NAVY = '#0F1E3D';
const CYAN = colors.primary;

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
});
