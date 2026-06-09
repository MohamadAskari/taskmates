import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { inspirationIdeas } from '../data/mockData';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';

export default function ProposeStakesScreen() {
  const navigation = useNavigation<any>();
  const { addProposal } = useApp();
  const [text, setText] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  const canSubmit = text.trim().length > 0;

  const handleSelectIdea = (idea: string) => {
    setSelectedIdea(idea);
    setText(idea);
  };

  const handleTextChange = (val: string) => {
    setText(val);
    if (selectedIdea && val !== selectedIdea) {
      setSelectedIdea(null);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const newProposal = {
      id: `p_${Date.now()}`,
      text: text.trim(),
      proposedBy: 'Alex',
      votes: 1,
      leading: false,
    };
    addProposal(newProposal);
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
          <Text style={styles.subtitle}>Make last place worth avoiding</Text>

          <Text style={styles.sectionLabel}>YOUR PROPOSAL</Text>
          <TextInput
            style={styles.input}
            placeholder='e.g. Sing a song on the group video call 🎤'
            placeholderTextColor={COLORS.textMuted}
            value={text}
            onChangeText={handleTextChange}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.sectionLabel}>NEED INSPIRATION?</Text>
          {inspirationIdeas.map(idea => {
            const selected = selectedIdea === idea;
            return (
              <TouchableOpacity
                key={idea}
                style={[styles.ideaCard, selected && styles.ideaCardSelected]}
                onPress={() => handleSelectIdea(idea)}
                activeOpacity={0.8}
              >
                <Text style={[styles.ideaText, selected && styles.ideaTextSelected]}>{idea}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.8}
          >
            <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
              Submit proposal
            </Text>
          </TouchableOpacity>
          <Text style={styles.caption}>Your proposal starts with your own vote</Text>
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
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
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
    padding: SPACING.base,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.base,
  },
  ideaCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...SHADOW,
  },
  ideaCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  ideaText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  ideaTextSelected: {
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
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
  caption: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
