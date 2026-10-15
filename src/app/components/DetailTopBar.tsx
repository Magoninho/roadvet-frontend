import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/theme';
import { IconActionButton } from './IconActionButton';
import { ScreenHero } from './ScreenHero';

interface DetailTopBarProps {
  onBackPress: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  /** Rendered inside the brand header below the action row, e.g. the record's avatar and name. */
  children?: ReactNode;
}

export function DetailTopBar({ onBackPress, onEditPress, onDeletePress, children }: DetailTopBarProps) {
  return (
    <ScreenHero style={styles.hero}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Voltar"
        >
          <Icon name="chevron-left" size={28} color={COLORS.onBrand} />
        </TouchableOpacity>

        {(onEditPress || onDeletePress) && (
          <View style={styles.actionsWrapper}>
            {onEditPress && (
              <IconActionButton icon="pencil-outline" onPress={onEditPress} accessibilityLabel="Editar" />
            )}
            {onDeletePress && (
              <IconActionButton icon="trash-can-outline" onPress={onDeletePress} accessibilityLabel="Excluir" />
            )}
          </View>
        )}
      </View>

      {children}
    </ScreenHero>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  actionsWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
});
