import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../data/mockData';
import Badge from './Badge';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';

interface TaskItemProps {
  task: Task;
  onMarkDone?: () => void;
  showDoneButton?: boolean;
}

export default function TaskItem({ task, onMarkDone, showDoneButton = true }: TaskItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleDone = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.25, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => onMarkDone?.());
  };

  return (
    <View style={styles.card}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {task.done ? (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        ) : (
          <View style={styles.emptyCheck} />
        )}
      </Animated.View>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            task.done && styles.titleDone,
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </View>
      <Badge label={`+${task.points}`} variant="points" />
      {showDoneButton && !task.done && (
        <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.8}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...SHADOW,
    marginBottom: SPACING.sm,
  },
  emptyCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
    fontFamily: FONTS.regular,
  },
  doneBtn: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  doneBtnText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
  },
});
