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
  /** `grid`: compact tile for a multi-column list. `list`: full-width row. */
  layout?: 'grid' | 'list';
}

function OwnerAvatar({ photoUrl, compact = false }: { photoUrl?: string; compact?: boolean }) {
  if (photoUrl) {
    return <Image source={{ uri: photoUrl }} style={compact ? styles.listAvatarImage : styles.avatarImage} />;
  }

  return (
    <View style={compact ? styles.listAvatarFallback : styles.avatarFallback}>
      <Icon name="account" size={compact ? 18 : 28} color="#5A5A5A" />
    </View>
  );
}

export function OwnerCard({ data, onPress, layout = 'grid' }: OwnerCardProps) {
  const { id, name, pets, photoUrl } = data;

  if (layout === 'list') {
    return (
      <TouchableOpacity
        style={styles.listCard}
        activeOpacity={0.8}
        onPress={() => onPress?.(id)}
      >
        <View style={styles.listLeftContent}>
          <OwnerAvatar photoUrl={photoUrl} compact />
          <View style={styles.listTextWrapper}>
            <Text style={styles.listName} numberOfLines={1}>{name}</Text>
            <Text style={styles.listPets} numberOfLines={1}>
              {pets.length > 0 ? pets.join(', ') : 'Nenhum pet cadastrado'}
            </Text>
          </View>
        </View>

        <View style={styles.listPetCount}>
          <Icon name="paw" size={14} color="#5A5A5A" />
          <Text style={styles.listPetCountText}>{pets.length}</Text>
        </View>
      </TouchableOpacity>
    );
  }

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
  listCard: {
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
  listLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listTextWrapper: {
    flex: 1,
    marginRight: 12,
  },
  listAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  listAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  listPets: {
    fontSize: 12,
    color: '#9A9A9A',
    marginTop: 2,
  },
  listPetCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPetCountText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#5A5A5A',
  },
});