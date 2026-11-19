import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBadge, BadgeType } from './StatusBadge';
import { COLORS, RADIUS, SPACING } from '@/theme';

export interface RecordCardData {
  id: string;
  petName: string;
  species: string;
  description: string;
  badges: BadgeType[];
  date: string;
  /** true = already in the cloud (green cloud); false = local only, waiting for the next sync (gray cloud). */
  synced: boolean;
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
        <Icon name={ species || "paw" } size={20} color={COLORS.brand} />
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
            accessibilityLabel={synced ? 'Sincronizado com a nuvem' : 'Salvo apenas neste aparelho'}
          />
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.control,
    padding: 16,
    marginHorizontal: SPACING.gutter,
    marginTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petName: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textMuted,
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
    color: COLORS.textMuted,
  },
});