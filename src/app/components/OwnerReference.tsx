import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OwnerReferenceProps {
  ownerName: string;
}

export function OwnerReference({ ownerName }: OwnerReferenceProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.deText}>de</Text>
      <View style={styles.row}>
        <Icon name="account" size={14} color="#5A5A5A" />
        <Text style={styles.name}>{ownerName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  deText: {
    fontSize: 12,
    color: '#9A9A9A',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  name: {
    marginLeft: 4,
    fontSize: 13,
    color: '#5A5A5A',
  },
});