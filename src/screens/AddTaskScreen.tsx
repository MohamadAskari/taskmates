import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { generateSteps } from '../api/generateSteps';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import { TasksStackParamList } from '../navigation/BottomTabNavigator';

type AddTaskNavProp = StackNavigationProp<TasksStackParamList, 'AddTask'>;

type Difficulty = 1 | 2 | 3;

const DIFFICULTY_LABELS: Record<Difficulty, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
const DIFFICULTY_COLORS: Record<Difficulty, string> = { 1: '#22C55E', 2: '#F97316', 3: '#EF4444' };
const DIFFICULTY_EMOJIS: Record<Difficulty, string> = { 1: '😌', 2: '💪', 3: '🔥' };

export default function AddTaskScreen() {
  const navigation = useNavigation<AddTaskNavProp>();
  const { addTask } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const canSubmit = title.trim().length > 0 && !isGenerating;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (aiEnabled) {
      setIsGenerating(true);
      setGenError('');
      try {
        const steps = await generateSteps(title.trim(), description.trim());
        navigation.getParent()?.navigate('AI Tool', {
          screen: 'AIOutput',
          params: { taskName: title.trim(), description: description.trim(), steps },
        });
      } catch {
        setGenError("Couldn't generate steps. Check your connection and try again.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    const newTask = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      points: difficulty,
      done: false,
    };
    addTask(newTask);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>WHAT DO YOU NEED TO DO?</Text>

          <TextInput
            style={[
              styles.titleInput,
              titleFocused && styles.inputFocused,
            ]}
            placeholder="e.g. Study chapter 3, Go for a run…"
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.expandToggle}
            onPress={() => setShowDescription(v => !v)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandToggleText}>
              {showDescription ? '▾ Hide details' : '+ Add details (optional)'}
            </Text>
          </TouchableOpacity>

          {showDescription && (
            <TextInput
              style={[styles.descInput, styles.inputFocused]}
              placeholder="Any extra context helps the AI give better steps…"
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              numberOfLines={4}
            />
          )}

          {/* Difficulty Picker */}
          <Text style={styles.sectionLabel}>DIFFICULTY</Text>
          <View style={styles.difficultyCard}>
            <View style={styles.difficultyTrack}>
              {([1, 2, 3] as Difficulty[]).map((level, i) => {
                const active = difficulty >= level;
                const selected = difficulty === level;
                const color = DIFFICULTY_COLORS[difficulty];
                return (
                  <React.Fragment key={level}>
                    {i > 0 && (
                      <View style={[styles.difficultyConnector, { backgroundColor: difficulty > i ? color : COLORS.border }]} />
                    )}
                    <TouchableOpacity
                      style={[
                        styles.difficultyStep,
                        { borderColor: active ? color : COLORS.border },
                        active && { backgroundColor: color },
                      ]}
                      onPress={() => setDifficulty(level)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.difficultyStepNum, { color: active ? COLORS.white : COLORS.textMuted }]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
            <View style={styles.difficultyLabelRow}>
              <Text style={[styles.difficultyLabel, { color: DIFFICULTY_COLORS[difficulty] }]}>
                {DIFFICULTY_EMOJIS[difficulty]}  {DIFFICULTY_LABELS[difficulty]}
              </Text>
              <Text style={styles.difficultyPoints}>+{difficulty} pt{difficulty > 1 ? 's' : ''}</Text>
            </View>
          </View>

          {/* AI error */}
          {!!genError && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{genError}</Text>
            </View>
          )}

          {/* AI Toggle Card */}
          <View style={[styles.aiCard, aiEnabled && styles.aiCardActive]}>
            <View style={styles.aiCardLeft}>
              <View style={styles.aiIconWrap}>
                <Ionicons name="sparkles" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.aiCardText}>
                <Text style={styles.aiCardTitle}>Hard task? Break it down with AI →</Text>
                <Text style={styles.aiCardSubtitle}>AI generates clear steps to follow</Text>
              </View>
            </View>
            <Switch
              value={aiEnabled}
              onValueChange={setAiEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
              thumbColor={aiEnabled ? COLORS.primary : COLORS.white}
              ios_backgroundColor={COLORS.border}
            />
          </View>
        </ScrollView>

        {/* Submit button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.8}
          >
            {aiEnabled ? (
              <>
                <Ionicons name="sparkles" size={18} color={title.trim().length > 0 ? COLORS.white : COLORS.textMuted} />
                <Text style={[styles.submitBtnText, !title.trim() && styles.submitBtnTextDisabled]}>
                  {isGenerating ? '✨ Generating steps…' : 'Break it down'}
                </Text>
              </>
            ) : (
              <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
                Add task
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 24,
  },
  sectionLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  titleInput: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.base,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.sm,
  },
  descInput: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: SPACING.base,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: SPACING.base,
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  expandToggle: {
    marginBottom: SPACING.base,
  },
  expandToggleText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
  difficultyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW,
  },
  difficultyTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  difficultyConnector: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  difficultyStep: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  difficultyStepNum: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  difficultyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
  },
  difficultyPoints: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
  errorCard: {
    backgroundColor: '#FFF0F0',
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: '#CC0000',
    textAlign: 'center',
  },
  aiCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW,
  },
  aiCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  aiCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  aiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCardText: {
    flex: 1,
  },
  aiCardTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  aiCardSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  submitBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  submitBtnTextDisabled: {
    color: COLORS.textMuted,
  },
});
