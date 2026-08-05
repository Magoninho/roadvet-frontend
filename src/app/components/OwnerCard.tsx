import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface OwnerCardData {
  id: string;
  name: string;
  pets: string[];
}

interface OwnerCardProps {
  data: OwnerCardData;
  onPress?: (id: string) => void;
}

export function OwnerCard({ data, onPress }: OwnerCardProps) {
  const { id, name, pets } = data;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >
      <View style={styles.avatarWrapper}>
        <Icon name="account" size={28} color="#5A5A5A" />
      </View>

      <Text style={styles.name}>{name}</Text>

      <View style={styles.petsWrapper}>
        {pets.slice(0, 2).map((pet, index) => (
          <View key={`${id}-pet-${index}`} style={styles.petRow}>
            <Icon name="paw" size={12} color="#8A8A8A" />
            <Text style={styles.petName}>{pet}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    margin: 6,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  petsWrapper: {
    alignSelf: 'stretch',
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  petName: {
    marginLeft: 4,
    fontSize: 12,
    color: '#8A8A8A',
  },
});