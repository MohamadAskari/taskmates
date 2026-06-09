import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native';
import { generateSteps } from '../api/generateSteps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import { AIStackParamList } from '../navigation/BottomTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type AIToolNavProp = StackNavigationProp<AIStackParamList, 'AITool'>;
type AIToolRouteProp = RouteProp<AIStackParamList, 'AITool'>;

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

export default function AIToolScreen() {
  const navigation = useNavigation<AIToolNavProp>();
  const route = useRoute<AIToolRouteProp>();
  const prefill = route.params?.prefillTask ?? '';

  const [taskName, setTaskName] = useState(prefill);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  useEffect(() => {
    if (route.params?.resetForm) {
      setTaskName('');
      setDescription('');
      setGenError('');
      navigation.setParams({ resetForm: undefined });
    }
  }, [route.params?.resetForm, navigation]);

  const canGenerate = taskName.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;
    setIsGenerating(true);
    setGenError('');
    try {
      const steps = await generateSteps(taskName.trim(), description.trim());
      navigation.navigate('AIOutput', {
        taskName: taskName.trim(),
        description: description.trim(),
        steps,
      });
    } catch {
      setGenError("Couldn't generate steps. Check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
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
          {/* AI badge */}
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={14} color={COLORS.primary} />
            <Text style={styles.aiBadgeText}>Powered by AI</Text>
          </View>

          <Text style={styles.sectionLabel}>TASK NAME</Text>
          <TextInput
            style={[styles.input, isGenerating && styles.inputDisabled]}
            placeholder="e.g. School assignment, gym session…"
            placeholderTextColor={COLORS.textMuted}
            value={taskName}
            onChangeText={setTaskName}
            editable={!isGenerating}
          />

          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <TextInput
            style={[styles.descInput, isGenerating && styles.inputDisabled]}
            placeholder="Describe the task in detail. The more you write, the better the steps…"
            placeholderTextColor={COLORS.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            numberOfLines={5}
            editable={!isGenerating}
          />

          {/* Loading card */}
          {isGenerating && (
            <View style={styles.loadingCard}>
              <View style={styles.dotsRow}>
                <LoadingDot delay={0} />
                <LoadingDot delay={200} />
                <LoadingDot delay={400} />
              </View>
              <Text style={styles.loadingText}>AI is crafting your step-by-step plan…</Text>
            </View>
          )}

          {/* Error message */}
          {!!genError && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{genError}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.generateBtn,
              !canGenerate && styles.generateBtnDisabled,
              isGenerating && styles.generateBtnGenerating,
            ]}
            onPress={handleGenerate}
            disabled={!canGenerate || isGenerating}
            activeOpacity={0.8}
          >
            {/* <Ionicons
              name="sparkles"
              size={18}
              color={canGenerate ? COLORS.white : COLORS.textMuted}
            /> */}
            <Text style={[styles.generateBtnText, !canGenerate && styles.generateBtnTextDisabled]}>
              {isGenerating ? '✨ Generating steps…' : '✦ Generate steps'}
            </Text>
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
  sectionLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    paddingVertical: 5,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.base,
    height: 54,
  },
  descInput: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.lg,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 128,
    textAlignVertical: 'top',
    marginBottom: SPACING.base,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  loadingCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOW,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  generateBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  generateBtnGenerating: {
    backgroundColor: COLORS.primaryLight,
  },
  generateBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  generateBtnTextDisabled: {
    color: COLORS.textMuted,
  },
  errorCard: {
    backgroundColor: '#FFF0F0',
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: '#CC0000',
    textAlign: 'center',
  },
});
