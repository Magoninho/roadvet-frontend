import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SelectInputProps {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}

export function SelectInput({ value, onSelect, options, placeholder, style }: SelectInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.text : styles.placeholder}>
          {value || placeholder}
        </Text>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#5A5A5A" />
      </TouchableOpacity>

      {open && (
        <View style={styles.optionsWrapper}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  placeholder: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  optionsWrapper: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: -1,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
});