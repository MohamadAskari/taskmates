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
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import { AIStackParamList } from '../navigation/BottomTabNavigator';
import { Difficulty } from '../api/generateSteps';

type AIOutputNavProp = StackNavigationProp<AIStackParamList, 'AIOutput'>;
type AIOutputRouteProp = RouteProp<AIStackParamList, 'AIOutput'>;

const DIFFICULTY_LABELS: Record<Difficulty, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
const DIFFICULTY_COLORS: Record<Difficulty, string> = { 1: '#22C55E', 2: '#F97316', 3: '#EF4444' };

export default function AIOutputScreen() {
  const navigation = useNavigation<AIOutputNavProp>();
  const route = useRoute<AIOutputRouteProp>();
  const { taskName, steps } = route.params;
  const { addTask } = useApp();

  const [selectedSteps, setSelectedSteps] = useState<Set<number>>(
    () => new Set(steps.map((_, i) => i)),
  );

  const toggleStep = (index: number) => {
    setSelectedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allSelected = selectedSteps.size === steps.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedSteps(new Set());
    } else {
      setSelectedSteps(new Set(steps.map((_, i) => i)));
    }
  };

  const handleAddSelected = () => {
    const groupId = `group_${Date.now()}`;
    steps.forEach((step, i) => {
      if (selectedSteps.has(i)) {
        addTask({
          id: `ai_${Date.now()}_${i}`,
          title: step.title,
          points: step.difficulty,
          done: false,
          groupId,
          groupTitle: taskName,
        });
      }
    });

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AITool', params: { resetForm: true } }],
      }),
    );
    navigation.getParent()?.navigate('Tasks', { screen: 'TaskList' });
  };

  const selectedCount = selectedSteps.size;
  const totalPoints = steps
    .filter((_, i) => selectedSteps.has(i))
    .reduce((sum, s) => sum + s.difficulty, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={14} color={COLORS.primary} />
          <Text style={styles.aiBadgeText}>AI generated</Text>
        </View>

        <Text style={styles.taskName}>{taskName}</Text>

        <View style={styles.selectionHeader}>
          <Text style={styles.selectionHint}>
            {selectedCount === 0
              ? 'Tap tasks to select'
              : `${selectedCount} of ${steps.length} selected`}
          </Text>
          <TouchableOpacity onPress={toggleAll} activeOpacity={0.7} style={styles.toggleAllBtn}>
            <Text style={styles.toggleAllText}>{allSelected ? 'Deselect all' : 'Select all'}</Text>
          </TouchableOpacity>
        </View>

        {steps.map((step, index) => {
          const selected = selectedSteps.has(index);
          const difficultyColor = DIFFICULTY_COLORS[step.difficulty];
          return (
            <TouchableOpacity
              key={index}
              style={[styles.stepCard, selected ? styles.stepCardSelected : styles.stepCardUnselected]}
              onPress={() => toggleStep(index)}
              activeOpacity={0.75}
            >
              <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
              </View>

              <View style={styles.stepContent}>
                <Text style={[styles.stepText, !selected && styles.stepTextUnselected]}>
                  {step.title}
                </Text>
                <View style={styles.stepMeta}>
                  <View style={[styles.difficultyPill, { backgroundColor: `${difficultyColor}18` }]}>
                    <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                      {DIFFICULTY_LABELS[step.difficulty]}
                    </Text>
                  </View>
                  <Text style={[styles.pointsText, !selected && styles.pointsTextUnselected]}>
                    +{step.difficulty} pt{step.difficulty > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addBtn, selectedCount === 0 && styles.addBtnDisabled]}
          onPress={handleAddSelected}
          disabled={selectedCount === 0}
          activeOpacity={0.8}
        >
          {selectedCount > 0 && (
            <Ionicons name="add-circle" size={20} color={COLORS.white} />
          )}
          <Text style={[styles.addBtnText, selectedCount === 0 && styles.addBtnTextDisabled]}>
            {selectedCount === 0
              ? 'Select tasks to add'
              : `Add ${selectedCount} task${selectedCount !== 1 ? 's' : ''} · +${totalPoints} pts`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tryAgainBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color={COLORS.textSecondary} />
          <Text style={styles.tryAgainText}>Try again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 16,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.base,
  },
  aiBadgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
  },
  taskName: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.base,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  selectionHint: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  toggleAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.full,
  },
  toggleAllText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    ...SHADOW,
  },
  stepCardSelected: {
    borderColor: COLORS.primary,
  },
  stepCardUnselected: {
    borderColor: COLORS.border,
    opacity: 0.55,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: COLORS.white,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepContent: {
    flex: 1,
    gap: 8,
  },
  stepText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  stepTextUnselected: {
    color: COLORS.textSecondary,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  difficultyText: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
  },
  pointsText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  pointsTextUnselected: {
    color: COLORS.textMuted,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  addBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  addBtnTextDisabled: {
    color: COLORS.textMuted,
  },
  tryAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  tryAgainText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});
