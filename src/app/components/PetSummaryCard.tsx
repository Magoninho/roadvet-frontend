import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PetSummaryData {
  id: string;
  name: string;
  age: string;
  gender: 'Macho' | 'Fêmea';
  breed: string;
  species?: 'dog' | 'cat';
}

interface PetSummaryCardProps {
  data: PetSummaryData;
  onPress?: (id: string) => void;
}

export function PetSummaryCard({ data, onPress }: PetSummaryCardProps) {
  const { id, name, age, gender, breed, species = 'cat' } = data;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >
      <View style={styles.leftContent}>
        <Icon name={species === 'dog' ? 'dog' : 'cat'} size={18} color="#1A1A1A" style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <Text style={styles.info}>
        {age} | {gender} | {breed}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 10,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  info: {
    fontSize: 12,
    color: '#9A9A9A',
  },
});