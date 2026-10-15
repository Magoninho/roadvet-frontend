import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING } from '@/theme';

interface SectionDividerProps {
  icon: string;
  label: string;
  /** Leave out the divider line, e.g. for the first section right below the brand header. */
  showLine?: boolean;
}

/** Section opener as on the home screen: full-width line, then an icon above a bold title. */
export function SectionDivider({ icon, label, showLine = true }: SectionDividerProps) {
  return (
    <View>
      {showLine && <View style={styles.line} />}
      <View style={styles.content}>
        <Icon name={icon} size={24} color={COLORS.textDark} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: SPACING.block,
  },
  content: {
    paddingHorizontal: SPACING.gutter,
    paddingTop: SPACING.section,
    paddingBottom: 4,
  },
  label: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
});
