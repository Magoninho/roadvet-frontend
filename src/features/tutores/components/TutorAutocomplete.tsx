import React, { useMemo } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '../../../ui/theme';

export interface TutorAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  onFocus: () => void;
  onSelectSuggestion: (name: string) => void;
}

export function TutorAutocomplete({
  value,
  onChangeText,
  suggestions,
  showSuggestions,
  onFocus,
  onSelectSuggestion,
}: TutorAutocompleteProps) {
  const filteredSuggestions = useMemo(() => {
    if (!value) return [];
    return suggestions.filter((name) =>
      name.toLowerCase().startsWith(value.toLowerCase())
    );
  }, [value, suggestions]);

  return (
    <View>
      <View style={styles.inputWrapper}>
        <Icon name="account" size={20} color="#5A5A5A" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tutor responsável..."
          placeholderTextColor="#B0B0B0"
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
      </View>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsWrapper}>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => onSelectSuggestion(item)}
              >
                <Text style={styles.suggestionText}>
                  <Text style={styles.suggestionTextBold}>
                    {item.slice(0, value.length)}
                  </Text>
                  {item.slice(value.length)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md - 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text.primary,
  },
  suggestionsWrapper: {
    marginHorizontal: spacing.lg,
    marginLeft: 46,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md - 2,
    backgroundColor: colors.cardBackground,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  suggestionTextBold: {
    fontWeight: '700',
  },
});
