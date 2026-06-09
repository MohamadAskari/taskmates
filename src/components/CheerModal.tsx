import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Member, cheerMessages } from '../data/mockData';
import Avatar from './Avatar';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';

interface CheerModalProps {
  visible: boolean;
  member: Member | null;
  onClose: () => void;
  onSend: (message: string) => void;
}

export default function CheerModal({ visible, member, onClose, onSend }: CheerModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');

  const handlePresetSelect = (msg: string) => {
    setCustomText('');
    setSelectedPreset(prev => (prev === msg ? null : msg));
  };

  const handleCustomChange = (text: string) => {
    setCustomText(text);
    setSelectedPreset(null);
  };

  const canSend = !!selectedPreset || customText.trim().length > 0;
  const activeMessage = customText.trim() || selectedPreset || '';

  const handleSend = () => {
    if (!canSend || !member) return;
    onSend(activeMessage);
    setSelectedPreset(null);
    setCustomText('');
  };

  const handleClose = () => {
    setSelectedPreset(null);
    setCustomText('');
    onClose();
  };

  if (!member) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Avatar initial={member.initial} color={member.color} size={40} />
              <View>
                <Text style={styles.headerTitle}>Cheer on {member.name}! 🎉</Text>
                <Text style={styles.headerSubtitle}>Pick a message or write your own</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.grid}>
              {cheerMessages.map(msg => {
                const selected = selectedPreset === msg;
                return (
                  <TouchableOpacity
                    key={msg}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => handlePresetSelect(msg)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{msg}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={styles.input}
              placeholder={`Write something personal to ${member.name}…`}
              placeholderTextColor={COLORS.textMuted}
              value={customText}
              onChangeText={handleCustomChange}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!canSend}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={16} color={canSend ? COLORS.white : COLORS.textMuted} />
              <Text style={[styles.sendBtnText, !canSend && styles.sendBtnTextDisabled]}>
                {canSend ? `Send to ${member.name}` : 'Select or type a message'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.modal,
    borderTopRightRadius: RADIUS.modal,
    paddingHorizontal: SPACING.base,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.base,
  },
  chip: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.base,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  sendBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  sendBtnTextDisabled: {
    color: COLORS.textMuted,
  },
});
