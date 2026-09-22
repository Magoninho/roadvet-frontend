import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { ConnectionIndicatorStatus } from '@/database/sync';

interface HeaderProps {
  title: string;
  syncStatus?: ConnectionIndicatorStatus;
}

const STATUS_CONFIG: Record<ConnectionIndicatorStatus, { icon: string; color: string; label: string }> = {
  offline: { icon: 'wifi-off', color: '#8A8A8A', label: 'Offline' },
  syncing: { icon: 'cloud-sync', color: '#2FA9E8', label: 'Sincronizando...' },
  online: { icon: 'cloud-check', color: '#22C55E', label: 'Online' },
};

export function Header({ title, syncStatus = 'online' }: HeaderProps) {
  const status = STATUS_CONFIG[syncStatus];

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '500',
  },
});
