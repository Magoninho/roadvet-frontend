import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconActionButton } from './IconActionButton';

interface DetailTopBarProps {
  onBackPress: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
}

export function DetailTopBar({ onBackPress, onEditPress, onDeletePress }: DetailTopBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon name="chevron-left" size={26} color="#1A1A1A" />
      </TouchableOpacity>

      {(onEditPress || onDeletePress) && (
        <View style={styles.actionsWrapper}>
          {onEditPress && (
            <IconActionButton icon="pencil-outline" color="#2FA9E8" onPress={onEditPress} />
          )}
          {onDeletePress && (
            <IconActionButton icon="trash-can-outline" color="#E85C5C" onPress={onDeletePress} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionsWrapper: {
    flexDirection: 'row',
  },
});