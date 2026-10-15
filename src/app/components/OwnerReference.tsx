import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/theme';

interface OwnerReferenceProps {
  ownerName: string;
}

/** "Tutor: <name>" line shown under a pet's name on the brand header. */
export function OwnerReference({ ownerName }: OwnerReferenceProps) {
  return (
    <View style={styles.row}>
      <Icon name="account-outline" size={16} color={COLORS.onBrandMuted} />
      <Text style={styles.text} numberOfLines={1}>
        Tutor: <Text style={styles.name}>{ownerName}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.onBrandMuted,
    flexShrink: 1,
  },
  name: {
    fontWeight: '600',
    color: COLORS.onBrand,
  },
});
