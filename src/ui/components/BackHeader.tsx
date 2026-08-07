import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '@/ui/theme';

export interface BackHeaderProps {
  title: string;
  onBackPress: () => void;
}

export function BackHeader({ title, onBackPress }: BackHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon name="chevron-left" size={26} color={colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    marginLeft: spacing.sm,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
});
