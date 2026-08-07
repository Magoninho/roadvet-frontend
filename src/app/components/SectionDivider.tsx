import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SectionDividerProps {
  icon: string;
  label: string;
}

export function SectionDivider({ icon, label }: SectionDividerProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.lineRow}>
        <View style={styles.line} />
      </View>
      <View style={styles.badge}>
        <Icon name={icon} size={12} color="#FFFFFF" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  lineRow: {
    width: '100%',
    alignItems: 'center',
  },
  line: {
    width: '85%',
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  badge: {
    position: 'absolute',
    top: -9,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});