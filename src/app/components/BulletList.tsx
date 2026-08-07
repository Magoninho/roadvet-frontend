import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BulletListProps {
  items: string[];
}

export function BulletList({ items }: BulletListProps) {
  return (
    <View style={styles.wrapper}>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  bullet: {
    fontSize: 13,
    color: '#1A1A1A',
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    color: '#1A1A1A',
  },
});