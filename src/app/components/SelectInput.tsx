import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS } from '@/theme';

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
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textDark} />
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  text: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  placeholder: {
    fontSize: 14,
    color: COLORS.placeholder,
  },
  optionsWrapper: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.control,
    backgroundColor: COLORS.bg,
    marginTop: 6,
    overflow: 'hidden',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
});