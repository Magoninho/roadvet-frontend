import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SyncDotProps {
  synced: boolean;
}

export function SyncDot({ synced }: SyncDotProps) {
  if (!synced) return null;
  return <View style={styles.dot} />;
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
});