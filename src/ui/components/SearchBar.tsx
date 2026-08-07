import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '@/ui/theme';

export interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Pesquisar...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Icon name="magnify" size={20} color="#9A9A9A" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9A9A9A"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F5',
    borderRadius: borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 15,
    color: colors.text.primary,
  },
});
