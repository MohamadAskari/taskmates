import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../data/mockData';
import TaskItem from './TaskItem';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';

interface TaskGroupCardProps {
  groupTitle: string;
  tasks: Task[];
  totalInGroup: number; // total across all tabs, for progress display
  doneInGroup: number;
  onMarkDone: (taskId: string, taskTitle: string, points: number) => void;
}

export default function TaskGroupCard({
  groupTitle,
  tasks,
  totalInGroup,
  doneInGroup,
  onMarkDone,
}: TaskGroupCardProps) {
  const [expanded, setExpanded] = useState(true);
  const chevronAnim = useRef(new Animated.Value(1)).current;

  const toggle = () => {
    Animated.timing(chevronAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setExpanded(v => !v);
  };

  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const allDone = doneInGroup === totalInGroup;
  const progressColor = allDone ? COLORS.success : COLORS.primary;

  return (
    <View style={styles.wrapper}>
      {/* Left accent strip */}
      <View style={[styles.accentStrip, { backgroundColor: progressColor }]} />

      <View style={styles.inner}>
        {/* Header row */}
        <TouchableOpacity
          style={styles.header}
          onPress={toggle}
          activeOpacity={0.7}
        >
          <View style={styles.headerLeft}>
            <View style={[styles.aiIcon, { backgroundColor: allDone ? '#DCFCE7' : COLORS.primaryBg }]}>
              <Ionicons
                name={allDone ? 'checkmark-done' : 'sparkles'}
                size={13}
                color={progressColor}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.groupTitle} numberOfLines={1}>
                {groupTitle}
              </Text>
              <Text style={[styles.progress, { color: progressColor }]}>
                {doneInGroup}/{totalInGroup} done
              </Text>
            </View>
          </View>

          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </Animated.View>
        </TouchableOpacity>

        {/* Task list */}
        {expanded && (
          <View style={styles.taskList}>
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                showDoneButton={!task.done}
                onMarkDone={() => onMarkDone(task.id, task.title, task.points)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    ...SHADOW,
  },
  accentStrip: {
    width: 4,
    borderTopLeftRadius: RADIUS.card,
    borderBottomLeftRadius: RADIUS.card,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.base,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  groupTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  progress: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
  },
  taskList: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
});
