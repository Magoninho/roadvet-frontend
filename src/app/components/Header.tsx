import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { ConnectionIndicatorStatus } from '@/database/sync';
import { COLORS } from '@/theme';
import { ScreenHero } from './ScreenHero';

interface HeaderProps {
  title: string;
  syncStatus?: ConnectionIndicatorStatus;
}

const STATUS_CONFIG: Record<ConnectionIndicatorStatus, { icon: string; label: string }> = {
  offline: { icon: 'wifi-off', label: 'Offline' },
  syncing: { icon: 'cloud-sync-outline', label: 'Sincronizando...' },
  online: { icon: 'cloud-check-outline', label: 'Online' },
};

export function Header({ title, syncStatus = 'online' }: HeaderProps) {
  const status = STATUS_CONFIG[syncStatus];

  return (
    <ScreenHero>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.statusWrapper}>
          <Icon name={status.icon} size={18} color={COLORS.onBrand} />
          <Text style={styles.statusText}>{status.label}</Text>
        </View>
      </View>
    </ScreenHero>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.onBrand,
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.onBrand,
  },
});
