import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BackHeaderProps {
  title: string;
  onBackPress: () => void;
}

export function BackHeader({ title, onBackPress }: BackHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon name="chevron-left" size={26} color="#1A1A1A" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});