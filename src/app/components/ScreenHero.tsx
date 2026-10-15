import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/theme';

interface ScreenHeroProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Brand-colored block at the top of a screen. It extends under the status bar, so the screen's
 * SafeAreaView must leave out the top edge.
 */
export function ScreenHero({ children, style }: ScreenHeroProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.hero, { paddingTop: insets.top + 16 }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.brand} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.brand,
    paddingHorizontal: SPACING.gutter,
    paddingBottom: 20,
  },
});
