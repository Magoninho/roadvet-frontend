import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SyncDot } from './SyncDot';

export interface PetCardData {
  id: string;
  name: string;
  age: string;
  breed?: string | null;
  ownerName: string;
  species?: 'dog' | 'cat';
  synced: boolean;
  photoUrl?: string;
}

interface PetCardProps {
  data: PetCardData;
  onPress?: (id: string) => void;
  showSyncDot?: boolean;
}

function PetAvatar({ photoUrl, species }: { photoUrl?: string; species: 'dog' | 'cat' }) {
  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={styles.avatarImage} />;
  }

  return (
    <View style={styles.avatarFallback}>
      <Icon name={species === 'cat' ? 'cat' : 'dog'} size={18} color="#5A5A5A" />
    </View>
  );
}

export function PetCard({ data, onPress, showSyncDot = true }: PetCardProps) {
  const { id, name, age, breed, ownerName, species = 'dog', synced, photoUrl } = data;
  const info = [age, breed].filter(Boolean).join(' | ');

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >

      <View style={styles.leftContent}>
        <PetAvatar photoUrl={photoUrl} species={species} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.info}>{info}</Text>
        </View>
      </View>

      <View style={styles.ownerRow}>
        <Icon name="account" size={16} color="#5A5A5A" />
        <Text style={styles.ownerName}>{ownerName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  info: {
    fontSize: 12,
    color: '#9A9A9A',
    marginTop: 2,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    marginLeft: 4,
    fontSize: 12,
    color: '#5A5A5A',
  },
});