import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing } from '@/ui/theme';

export type BadgeType = 'vaccine' | 'medication' | 'exam';

export interface StatusBadgeProps {
  type: BadgeType;
}

const BADGE_CONFIG: Record<BadgeType, { icon: string; color: string }> = {
  medication: { icon: 'needle', color: '#3B82F6' },
  vaccine: { icon: 'shield-alert', color: '#EF4444' },
  exam: { icon: 'flask', color: '#F5A623' },
};

export function StatusBadge({ type }: StatusBadgeProps) {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.medication;
  return (
    <View style={[styles.circle, { backgroundColor: config.color }]}>
      <Icon name={config.icon} size={14} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
  },
});
