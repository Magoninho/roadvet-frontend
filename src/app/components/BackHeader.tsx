import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/theme';
import { ScreenHero } from './ScreenHero';

interface BackHeaderProps {
  title: string;
  onBackPress: () => void;
  rightElement?: ReactNode;
}

export function BackHeader({ title, onBackPress, rightElement }: BackHeaderProps) {
  return (
    <ScreenHero>
      <View style={styles.row}>
        <View style={styles.leftRow}>
          <TouchableOpacity
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Voltar"
          >
            <Icon name="chevron-left" size={28} color={COLORS.onBrand} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {rightElement}
      </View>
    </ScreenHero>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.onBrand,
    flexShrink: 1,
  },
});
