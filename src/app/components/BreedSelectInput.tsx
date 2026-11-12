import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { racasDaEspecie } from '@/utils/racas';
import { normalizeSearchText } from '@/utils/search';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface BreedSelectInputProps {
  /** Species whose breeds are listed; the field stays disabled until one is chosen. */
  especie: string;
  value: string;
  onSelect: (raca: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Breed picker: a field styled like `SelectInput` that opens a bottom sheet with a searchable list of
 * the species' breeds. When the search matches no breed exactly, the typed text can be used as is,
 * so breeds missing from the catalog can still be recorded.
 */
export function BreedSelectInput({ especie, value, onSelect, placeholder = 'Raça', style }: BreedSelectInputProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();

  const disabled = !especie;
  const racas = useMemo(() => racasDaEspecie(especie), [especie]);

  const normalizedQuery = normalizeSearchText(query);
  const filtered = useMemo(
    () => (normalizedQuery ? racas.filter((raca) => normalizeSearchText(raca).includes(normalizedQuery)) : racas),
    [racas, normalizedQuery],
  );
  const customValue = query.trim();
  const showCustomOption =
    !!customValue && !racas.some((raca) => normalizeSearchText(raca) === normalizedQuery);

  const handleOpen = () => {
    setQuery('');
    setOpen(true);
  };

  const handleSelect = (raca: string) => {
    onSelect(raca);
    setOpen(false);
  };

  return (
    <View style={style}>
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={handleOpen}
        activeOpacity={0.8}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={disabled ? 'Raça: selecione a espécie primeiro' : `Raça: ${value || 'não selecionada'}`}
      >
        <Text style={[value ? styles.text : styles.placeholder, styles.flexText]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={18} color={disabled ? COLORS.placeholder : COLORS.textDark} />
      </TouchableOpacity>

      <Modal
        visible={open}
        animationType="slide"
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior="padding"
          automaticOffset
          // The keyboard already covers the navigation bar inset, so it is discounted while the keyboard is open.
          keyboardVerticalOffset={-insets.bottom}
        >
          <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
            <Pressable style={[styles.sheet, { paddingBottom: SHEET_BOTTOM_PADDING + insets.bottom }]} onPress={() => {}}>
              <View style={styles.header}>
                <Text style={styles.title}>Raça ({especie})</Text>
                <TouchableOpacity onPress={() => setOpen(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name="close" size={22} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              <View style={styles.search}>
                <Icon name="magnify" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar raça"
                  placeholderTextColor={COLORS.placeholder}
                  value={query}
                  onChangeText={setQuery}
                  autoCorrect={false}
                  returnKeyType="done"
                />
              </View>

              <FlatList
                data={filtered}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                style={styles.list}
                ListHeaderComponent={
                  showCustomOption ? (
                    <TouchableOpacity style={styles.option} onPress={() => handleSelect(customValue)}>
                      <Icon name="plus" size={18} color={COLORS.brand} />
                      <Text style={[styles.optionText, styles.customText]}>Usar &quot;{customValue}&quot;</Text>
                    </TouchableOpacity>
                  ) : null
                }
                renderItem={({ item }) => {
                  const selected = item === value;
                  return (
                    <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item}</Text>
                      {selected && <Icon name="check" size={18} color={COLORS.brand} />}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  showCustomOption ? null : <Text style={styles.empty}>Nenhuma raça encontrada.</Text>
                }
              />
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const SHEET_BOTTOM_PADDING = 32;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  flexText: {
    flex: 1,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  placeholder: {
    fontSize: 14,
    color: COLORS.placeholder,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.sheet,
    borderTopRightRadius: RADIUS.sheet,
    paddingTop: SPACING.section,
    paddingHorizontal: SPACING.gutter,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: COLORS.textDark,
  },
  list: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: COLORS.brand,
  },
  customText: {
    marginLeft: 8,
    color: COLORS.brand,
    fontWeight: '600',
  },
  empty: {
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
