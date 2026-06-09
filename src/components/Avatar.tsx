import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../theme/typography';
import { COLORS } from '../theme/colors';

interface AvatarProps {
  initial: string;
  color: string;
  size?: number;
}

export default function Avatar({ initial, color, size = 36 }: AvatarProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
});
