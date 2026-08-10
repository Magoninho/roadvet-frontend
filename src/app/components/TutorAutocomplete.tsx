import React, { useMemo } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TutorAutocompleteProps {
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
    <View style={{zIndex: 1}}>
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
    marginHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  suggestionsWrapper: {
    position: 'absolute', // Pulls the element out of the flow
    top: 50, // Adjust this value slightly if it overlaps your input text
    left: 0, // Matches your old marginLeft
    right: 0, // Matches your old marginHorizontal right side
    zIndex: 1000, // Forces it to render on top for iOS
    elevation: 5, // Forces it to render on top for Android, adds drop shadow
    marginHorizontal: 16,
    marginLeft: 46,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
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
    color: '#1A1A1A',
  },
  suggestionTextBold: {
    fontWeight: '700',
  },
});