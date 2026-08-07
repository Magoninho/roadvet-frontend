import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '@/ui/theme';

export type SyncStatus = 'offline' | 'synced' | 'pending';

export interface HeaderProps {
  title: string;
  syncStatus?: SyncStatus;
}

const STATUS_CONFIG: Record<SyncStatus, { icon: string; color: string; label: string }> = {
  offline: { icon: 'wifi-off', color: colors.status.offline, label: 'Offline' },
  synced: { icon: 'cloud-check', color: colors.status.synced, label: 'Online' },
  pending: { icon: 'cloud-sync', color: colors.status.pending, label: 'Sincronizando' },
};

export function Header({ title, syncStatus = 'synced' }: HeaderProps) {
  const status = STATUS_CONFIG[syncStatus] || STATUS_CONFIG.synced;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.statusWrapper}>
        <Icon name={status.icon} size={16} color={status.color} />
        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: spacing.xs,
    fontSize: 13,
    fontWeight: '500',
  },
});
