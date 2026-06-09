import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import TaskItem from '../components/TaskItem';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import { TasksStackParamList } from '../navigation/BottomTabNavigator';

type TasksNavProp = StackNavigationProp<TasksStackParamList, 'TaskList'>;

type TabKey = 'All' | 'Pending' | 'Done';

export default function TaskListScreen() {
  const navigation = useNavigation<TasksNavProp>();
  const { tasks, markTaskDone } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('All');

  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  const displayed =
    activeTab === 'Pending' ? pending :
    activeTab === 'Done'    ? done    :
    [...pending, ...done];

  const handleDone = (taskId: string, taskTitle: string, points: number) => {
    markTaskDone(taskId);
    navigation.navigate('PointsConfirmationFromTasks', { taskId, taskTitle, points });
  };

  const tabs: { key: TabKey; count: number }[] = [
    { key: 'All',     count: tasks.length  },
    { key: 'Pending', count: pending.length },
    { key: 'Done',    count: done.length    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
      </View>

      {/* Tabs + Add button */}
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.key} ({tab.count})
            </Text>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
        <View style={styles.tabSpacer} />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTask')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayed.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No tasks here yet!</Text>
          </View>
        ) : (
          displayed.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              showDoneButton={!task.done}
              onMarkDone={() => handleDone(task.id, task.title, task.points)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating + button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  addBtnText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabSpacer: {
    flex: 1,
  },
  tab: {
    paddingVertical: 12,
    marginRight: SPACING.lg,
    position: 'relative',
  },
  tabText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 90,
  },
  empty: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW,
    shadowOpacity: 0.25,
  },
});
