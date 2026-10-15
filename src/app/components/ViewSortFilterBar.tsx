import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, RADIUS, SPACING } from '@/theme';

export type ViewMode = 'grid' | 'list';

interface ViewSortFilterBarProps {
  /** Current layout of the list below; the button shows (and switches to) the other one. */
  viewMode: ViewMode;
  onViewPress: () => void;
  onSortPress: () => void;
  onFilterPress: () => void;
  filterActive?: boolean;
}

export function ViewSortFilterBar({
  viewMode,
  onViewPress,
  onSortPress,
  onFilterPress,
  filterActive = false,
}: ViewSortFilterBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onViewPress}
        accessibilityLabel={viewMode === 'grid' ? 'Visualizar em lista' : 'Visualizar em grade'}
      >
        <Icon name={viewMode === 'grid' ? 'view-list' : 'view-grid'} size={16} color={COLORS.textDark} />
        <Text style={styles.text}>Visualização</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onSortPress}>
        <Icon name="sort" size={16} color={COLORS.textDark} />
        <Text style={styles.text}>Ordenar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onFilterPress}>
        <View>
          <Icon name="filter-variant" size={16} color={COLORS.textDark} />
          {filterActive && <View style={styles.badge} />}
        </View>
        <Text style={styles.text}>Filtrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.gutter,
    marginTop: 12,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  text: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.brand,
  },
});
