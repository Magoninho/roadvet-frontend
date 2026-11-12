import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { deleteAvatarFile, persistAvatarFile } from '@/database/repositories/avatars';
import { isRemoteAvatarUri, updateVeterinario } from '@/database/repositories/veterinarios';
import { synchronizeDatabase, uploadPendingAvatars } from '@/database/sync';
import { pickAvatarImage, type PickedAvatar } from '@/utils/pickAvatarImage';
import { DetailTopBar } from '../components/DetailTopBar';
import { EditableAvatar } from '../components/EditableAvatar';
import { FormFooter } from '../components/FormFooter';
import { GhostButton } from '../components/GhostButton';
import { InfoText } from '../components/InfoText';
import { LabeledInput } from '../components/LabeledInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionDivider } from '../components/SectionDivider';
import { COLORS, SPACING } from '@/theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

/** A new photo picked in edit mode, or `'remove'` to clear the current one. */
type AvatarChange = PickedAvatar | 'remove' | null;

/** Pushes the edit and uploads a newly picked photo right away when online; harmless when offline. */
function syncProfileInBackground(veterinarioId: string) {
  synchronizeDatabase()
    .then(() => uploadPendingAvatars(veterinarioId))
    .catch(() => {});
}

export default function PerfilScreen() {
  const router = useRouter();
  const { veterinario, updateProfile, changePassword, logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [crmv, setCrmv] = useState('');
  const [telefone, setTelefone] = useState('');
  const [avatarChange, setAvatarChange] = useState<AvatarChange>(null);

  const [passwordFormVisible, setPasswordFormVisible] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (!veterinario) {
    return <SafeAreaView style={styles.container} />;
  }

  const currentAvatar = veterinario.avatarUrl ?? undefined;
  const shownAvatar =
    avatarChange === 'remove' ? undefined : avatarChange ? avatarChange.uri : currentAvatar;

  const handleBack = () => {
    if (editMode) {
      handleCancelEdit();
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/home');
  };

  const handleEnableEdit = () => {
    setNome(veterinario.nome);
    setEmail(veterinario.email);
    setCrmv(veterinario.crmv ?? '');
    setTelefone(veterinario.telefone ?? '');
    setAvatarChange(null);
    setError(null);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setAvatarChange(null);
    setError(null);
  };

  const handleChangePhoto = async () => {
    const picked = await pickAvatarImage();
    if (picked) setAvatarChange(picked);
  };

  const saveAvatarChange = async () => {
    if (!avatarChange) return;
    const previous = veterinario.avatarUrl;
    const next = avatarChange === 'remove' ? null : await persistAvatarFile(avatarChange.uri, avatarChange.fileName);
    await updateVeterinario(veterinario, { avatarUrl: next });
    if (previous && previous !== next && !isRemoteAvatarUri(previous)) {
      await deleteAvatarFile(previous);
    }
  };

  const handleSaveEdit = async () => {
    if (!nome.trim() || !email.trim()) {
      setError('Preencha os campos marcados com *.');
      return;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Informe um email válido.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await updateProfile({
        nome,
        email,
        crmv: crmv || null,
        telefone: telefone || null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }

      await saveAvatarChange();
      syncProfileInBackground(veterinario.id);
      setAvatarChange(null);
      setEditMode(false);
    } catch {
      setError('Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const resetPasswordForm = () => {
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    setPasswordError(null);
  };

  const handleOpenPasswordForm = () => {
    resetPasswordForm();
    setPasswordSuccess(false);
    setPasswordFormVisible(true);
  };

  const handleCancelPassword = () => {
    resetPasswordForm();
    setPasswordFormVisible(false);
  };

  const handleSavePassword = async () => {
    if (passwordSaving) return;
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setPasswordError('Preencha todos os campos.');
      return;
    }
    if (novaSenha.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setPasswordError('A confirmação não confere com a nova senha.');
      return;
    }

    setPasswordSaving(true);
    setPasswordError(null);
    try {
      const result = await changePassword(senhaAtual, novaSenha);
      if (!result.ok) {
        setPasswordError(result.error);
        return;
      }
      resetPasswordForm();
      setPasswordFormVisible(false);
      setPasswordSuccess(true);
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <DetailTopBar onBackPress={handleBack} onEditPress={editMode ? undefined : handleEnableEdit}>
        <EditableAvatar
          photoUrl={shownAvatar}
          editable={editMode}
          onPress={handleChangePhoto}
          size={72}
          tone="onBrand"
          style={styles.avatar}
        />

        {editMode ? (
          <LabeledInput
            label="Nome*"
            labelTone="onBrand"
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
            containerStyle={styles.nameInput}
          />
        ) : (
          <>
            <Text style={styles.name}>{veterinario.nome}</Text>
            <Text style={styles.subtitle}>{veterinario.email}</Text>
          </>
        )}
      </DetailTopBar>

      <KeyboardAvoidingView style={styles.flex} behavior="padding" automaticOffset>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <SectionDivider icon="account-outline" label="Dados pessoais" showLine={false} />
          {editMode ? (
            <>
              <LabeledInput
                label="Email*"
                placeholder="nome@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.fullInput}
              />
              <LabeledInput
                label="CRMV"
                placeholder="Ex.: CE-12345"
                value={crmv}
                onChangeText={setCrmv}
                autoCapitalize="characters"
                containerStyle={styles.fullInput}
              />
              <LabeledInput
                label="Telefone"
                placeholder="(85) 99999-9999"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                containerStyle={styles.fullInput}
              />

              {shownAvatar ? (
                <View style={styles.buttonSpacing}>
                  <GhostButton label="Remover foto" icon="image-remove" onPress={() => setAvatarChange('remove')} />
                </View>
              ) : null}

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </>
          ) : (
            <>
              <InfoText label="Nome" value={veterinario.nome} />
              <InfoText label="Email" value={veterinario.email} />
              <InfoText label="CRMV" value={veterinario.crmv || 'Não informado'} />
              <InfoText label="Telefone" value={veterinario.telefone || 'Não informado'} />
            </>
          )}

          {!editMode && (
            <>
              <SectionDivider icon="lock-outline" label="Segurança" />
              {passwordFormVisible ? (
                <>
                  <LabeledInput
                    label="Senha atual"
                    placeholder="Digite sua senha atual"
                    value={senhaAtual}
                    onChangeText={setSenhaAtual}
                    secureTextEntry
                    autoCapitalize="none"
                    containerStyle={styles.fullInput}
                  />
                  <LabeledInput
                    label="Nova senha"
                    placeholder="Mínimo de 6 caracteres"
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    secureTextEntry
                    autoCapitalize="none"
                    containerStyle={styles.fullInput}
                  />
                  <LabeledInput
                    label="Confirmar nova senha"
                    placeholder="Repita a nova senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                    autoCapitalize="none"
                    containerStyle={styles.fullInput}
                  />
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                  <PrimaryButton
                    label={passwordSaving ? 'Salvando...' : 'Salvar nova senha'}
                    icon="check"
                    onPress={handleSavePassword}
                  />
                  <View style={styles.buttonSpacing}>
                    <GhostButton label="Cancelar" icon="close" onPress={handleCancelPassword} />
                  </View>
                </>
              ) : (
                <>
                  {passwordSuccess ? <Text style={styles.successText}>Senha alterada com sucesso.</Text> : null}
                  <View style={styles.buttonSpacing}>
                    <GhostButton label="Alterar senha" icon="key-outline" onPress={handleOpenPasswordForm} />
                  </View>
                </>
              )}

              <SectionDivider icon="cog-outline" label="Conta" />
              <View style={styles.buttonSpacing}>
                <GhostButton label="Sair da conta" icon="logout" onPress={logout} />
              </View>
            </>
          )}
        </ScrollView>

        {editMode && <FormFooter onCancel={handleCancelEdit} onSave={handleSaveEdit} saving={saving} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: SPACING.block,
  },
  avatar: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onBrand,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.onBrandMuted,
    marginTop: 4,
  },
  nameInput: {
    marginTop: 16,
  },
  fullInput: {
    marginHorizontal: SPACING.gutter,
    marginTop: 12,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  errorText: {
    marginHorizontal: SPACING.gutter,
    marginTop: 12,
    fontSize: 13,
    color: COLORS.danger,
  },
  successText: {
    marginHorizontal: SPACING.gutter,
    marginTop: 8,
    fontSize: 13,
    color: COLORS.brand,
  },
});
