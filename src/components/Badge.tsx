import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../theme/typography';

type BadgeVariant = 'points' | 'leading' | 'warning' | 'vote';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  points:  { bg: '#FEF3C7', text: '#92400E' },
  leading: { bg: '#DCFCE7', text: '#166534' },
  warning: { bg: '#EF4444', text: '#FFFFFF' },
  vote:    { bg: '#EF4444', text: '#FFFFFF' },
};

export default function Badge({ label, variant = 'points' }: BadgeProps) {
  const style = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.label, { color: style.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
});
