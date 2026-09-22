import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { SortDirection, SortOption, SortState } from '@/utils/sort';

interface SortSheetProps {
  visible: boolean;
  title?: string;
  options: SortOption[];
  value: SortState;
  onChange: (next: SortState) => void;
  onClose: () => void;
}

function directionLabel(option: SortOption, direction: SortDirection): string {
  return direction === 'asc' ? option.ascLabel : option.descLabel;
}

export function SortSheet({ visible, title = 'Ordenar por', options, value, onChange, onClose }: SortSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={22} color="#5A5A5A" />
            </TouchableOpacity>
          </View>

          {options.map((option) => {
            const isActive = value.key === option.key;
            const direction = isActive ? value.direction : option.defaultDirection;

            return (
              <TouchableOpacity
                key={option.key}
                style={styles.row}
                activeOpacity={0.7}
                onPress={() => onChange({ key: option.key, direction })}
              >
                <View style={styles.rowLeft}>
                  <Icon
                    name={isActive ? 'radiobox-marked' : 'radiobox-blank'}
                    size={20}
                    color={isActive ? '#12b4c4' : '#C7C7CC'}
                  />
                  <Text style={[styles.rowLabel, isActive && styles.rowLabelActive]}>
                    {isActive ? directionLabel(option, direction) : option.label}
                  </Text>
                </View>

                <View style={styles.directionToggle}>
                  <TouchableOpacity
                    style={[styles.directionButton, isActive && direction === 'asc' && styles.directionButtonActive]}
                    onPress={() => onChange({ key: option.key, direction: 'asc' })}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <Icon
                      name="arrow-up"
                      size={16}
                      color={isActive && direction === 'asc' ? '#FFFFFF' : '#9A9A9A'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.directionButton, isActive && direction === 'desc' && styles.directionButtonActive]}
                    onPress={() => onChange({ key: option.key, direction: 'desc' })}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <Icon
                      name="arrow-down"
                      size={16}
                      color={isActive && direction === 'desc' ? '#FFFFFF' : '#9A9A9A'}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rowLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#1A1A1A',
    flexShrink: 1,
  },
  rowLabelActive: {
    fontWeight: '600',
    color: '#12b4c4',
  },
  directionToggle: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F5',
    borderRadius: 10,
    padding: 2,
  },
  directionButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionButtonActive: {
    backgroundColor: '#12b4c4',
  },
});
