import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, borderRadius } from '@/ui/theme';

export interface DateInputProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DateInput({ value, onChange, placeholder = 'Data de nasc.', style }: DateInputProps) {
  const [showPicker, setShowPicker] = React.useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.input, style]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.text : styles.placeholder}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Icon name="calendar" size={18} color="#5A5A5A" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md - 2,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    color: colors.text.primary,
  },
  placeholder: {
    fontSize: 14,
    color: '#B0B0B0',
  },
});
