import React, { useMemo } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING } from '@/theme';
import { FieldLabel } from './FormField';

export interface TutorSuggestion {
  id: string;
  label: string;
}

interface TutorAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  suggestions: TutorSuggestion[];
  showSuggestions: boolean;
  onFocus: () => void;
  onSelectSuggestion: (suggestion: TutorSuggestion) => void;
  /** Title shown above the field, aligned with the text box. */
  label?: string;
  placeholder?: string;
}

export function TutorAutocomplete({
  value,
  onChangeText,
  suggestions,
  showSuggestions,
  onFocus,
  onSelectSuggestion,
  label,
  placeholder = 'Tutor responsável...',
}: TutorAutocompleteProps) {
  const filteredSuggestions = useMemo(() => {
    if (!value) return [];
    return suggestions.filter((suggestion) =>
      suggestion.label.toLowerCase().startsWith(value.toLowerCase())
    );
  }, [value, suggestions]);

  return (
    <View style={{zIndex: 1}}>
      {label ? <FieldLabel label={label} style={styles.label} /> : null}
      {/* Own positioning context so the dropdown's `top` stays relative to the input, below the label. */}
      <View>
        <View style={styles.inputWrapper}>
          <Icon name="account" size={20} color={COLORS.textDark} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
          />
        </View>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <View style={styles.suggestionsWrapper}>
            <FlatList
              data={filteredSuggestions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => onSelectSuggestion(item)}
                >
                  <Text style={styles.suggestionText}>
                    <Text style={styles.suggestionTextBold}>
                      {item.label.slice(0, value.length)}
                    </Text>
                    {item.label.slice(value.length)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    // Lines up with the text box, which sits right of the 20px icon + 10px gap.
    marginLeft: SPACING.gutter + 30,
    marginRight: SPACING.gutter,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.gutter,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textDark,
  },
  suggestionsWrapper: {
    position: 'absolute', // Pulls the element out of the flow
    top: 50, // Adjust this value slightly if it overlaps your input text
    left: 0, // Matches your old marginLeft
    right: 0, // Matches your old marginHorizontal right side
    zIndex: 1000, // Forces it to render on top for iOS
    elevation: 5, // Forces it to render on top for Android, adds drop shadow
    marginHorizontal: SPACING.gutter,
    marginLeft: SPACING.gutter + 30,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.control,
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  suggestionTextBold: {
    fontWeight: '700',
  },
});
