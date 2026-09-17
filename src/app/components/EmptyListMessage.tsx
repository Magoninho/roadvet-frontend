import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EmptyListMessageProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export function EmptyListMessage({ icon = 'magnify', title, subtitle }: EmptyListMessageProps) {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={36} color="#C7C7CC" />
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  title: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#5A5A5A',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#9A9A9A',
    textAlign: 'center',
  },
});
