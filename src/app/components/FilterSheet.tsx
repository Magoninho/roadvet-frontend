import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { FilterChipGroupConfig, FilterState, FilterToggleConfig } from '@/utils/filter';
import { setToggle, toggleChip } from '@/utils/filter';

interface FilterSheetProps {
  visible: boolean;
  title?: string;
  chipGroups: FilterChipGroupConfig[];
  toggles: FilterToggleConfig[];
  value: FilterState;
  onChange: (next: FilterState) => void;
  onClear: () => void;
  onClose: () => void;
}

export function FilterSheet({
  visible,
  title = 'Filtrar',
  chipGroups,
  toggles,
  value,
  onChange,
  onClear,
  onClose,
}: FilterSheetProps) {
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

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {chipGroups.map((group) => (
              <View key={group.key} style={styles.section}>
                <Text style={styles.sectionTitle}>{group.title}</Text>
                {group.options.length === 0 ? (
                  <Text style={styles.emptyText}>Nada para filtrar ainda.</Text>
                ) : (
                  <View style={styles.chipsWrap}>
                    {group.options.map((option) => {
                      const selected = (value.chips[group.key] ?? []).includes(option.value);
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[styles.chip, selected && styles.chipSelected]}
                          activeOpacity={0.7}
                          onPress={() => onChange(toggleChip(value, group.key, option.value))}
                        >
                          {selected && <Icon name="check" size={14} color="#FFFFFF" style={styles.chipIcon} />}
                          <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}

            {toggles.map((toggle) => (
              <View key={toggle.key} style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>{toggle.label}</Text>
                <Switch
                  value={!!value.toggles[toggle.key]}
                  onValueChange={(active) => onChange(setToggle(value, toggle.key, active))}
                  trackColor={{ false: '#E5E5E5', true: '#9CE0E6' }}
                  thumbColor={value.toggles[toggle.key] ? '#12b4c4' : '#FFFFFF'}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={onClear} activeOpacity={0.8}>
              <Text style={styles.clearLabel}>Limpar filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.applyLabel}>Concluído</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scroll: {
    flexGrow: 0,
  },
  section: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A5A5A',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#B0B0B0',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipSelected: {
    backgroundColor: '#12b4c4',
    borderColor: '#12b4c4',
  },
  chipIcon: {
    marginRight: 4,
  },
  chipLabel: {
    fontSize: 13,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    flexShrink: 1,
    marginRight: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  clearButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 24,
    paddingVertical: 13,
  },
  clearLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A5A5A',
  },
  applyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12b4c4',
    borderRadius: 24,
    paddingVertical: 13,
  },
  applyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
