import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBadge, BadgeType } from './StatusBadge';

export interface RecordCardData {
  id: string;
  petName: string;
  species: string;
  description: string;
  badges: BadgeType[];
  date: string;
  synced: boolean; // true = já sincronizado (nuvem verde), false = pendente (nuvem cinza)
}

interface RecordCardProps {
  data: RecordCardData;
  onPress?: (id: string) => void;
}

export function RecordCard({ data, onPress }: RecordCardProps) {
  const { id, petName, species, description, badges, date, synced } = data;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress?.(id)}
    >
      <View style={styles.headerRow}>
        <Icon name={ species || "paw" } size={18} color="#1A1A1A" />
        <Text style={styles.petName}>{petName}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.badgesRow}>
          {badges.map((badge, index) => (
            <StatusBadge key={`${id}-${badge}-${index}`} type={badge} />
          ))}
        </View>

        <View style={styles.dateRow}>
          <Icon
            name={synced ? 'cloud-upload' : 'cloud-outline'}
            size={16}
            color={synced ? '#22C55E' : '#B0B0B0'}
          />
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petName: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    color: '#9A9A9A',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  badgesRow: {
    flexDirection: 'row',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#8A8A8A',
  },
});