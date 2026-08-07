import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface OwnerCardData {
  id: string;
  name: string;
  pets: string[];
  photoUrl?: string;
}

interface OwnerCardProps {
  data: OwnerCardData;
  onPress?: (id: string) => void;
}

function OwnerAvatar({ photoUrl }: { photoUrl?: string }) {
  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={styles.avatarImage} />;
  }

  return (
    <View style={styles.avatarFallback}>
      <Icon name="account" size={28} color="#5A5A5A" />
    </View>
  );
}

export function OwnerCard({ data, onPress }: OwnerCardProps) {
  const { id, name, pets, photoUrl } = data;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >
      <OwnerAvatar photoUrl={photoUrl} />

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
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: '1.16%',
    marginBottom: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  avatarFallback: {
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