import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SortFilterBarProps {
  onSortPress?: () => void;
  onFilterPress?: () => void;
  filterActive?: boolean;
}

export function SortFilterBar({ onSortPress, onFilterPress, filterActive = false }: SortFilterBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onSortPress}>
        <Icon name="sort" size={16} color="#5A5A5A" />
        <Text style={styles.text}>Ordenar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onFilterPress}>
        <View>
          <Icon name="filter-variant" size={16} color="#5A5A5A" />
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
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 4,
    fontSize: 13,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#12b4c4',
  },
});
