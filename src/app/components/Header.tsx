import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SyncStatus = 'offline' | 'synced';

interface HeaderProps {
  title: string;
  syncStatus?: SyncStatus;
}

const STATUS_CONFIG: Record<SyncStatus, { icon: string; color: string; label: string }> = {
  offline: { icon: 'wifi-off', color: '#8A8A8A', label: 'Offline' },
  synced: { icon: 'cloud-check', color: '#22C55E', label: 'Dados sincronizados' },
};

export function Header({ title, syncStatus = 'offline' }: HeaderProps) {
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