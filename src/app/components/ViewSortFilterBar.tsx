import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ViewSortFilterBarProps {
  onViewPress: () => void;
  onSortPress: () => void;
  onFilterPress: () => void;
}

export function ViewSortFilterBar({
  onViewPress,
  onSortPress,
  onFilterPress,
}: ViewSortFilterBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onViewPress}>
        <Icon name="view-list" size={16} color="#5A5A5A" />
        <Text style={styles.text}>Visualização</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onSortPress}>
        <Icon name="sort" size={16} color="#5A5A5A" />
        <Text style={styles.text}>Ordenar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onFilterPress}>
        <Icon name="filter-variant" size={16} color="#5A5A5A" />
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
    gap: 20,
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
});
