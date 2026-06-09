import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { notifications } from '../data/mockData';
import Avatar from '../components/Avatar';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';

export default function InboxScreen() {
  const navigation = useNavigation<any>();
  const { hasVoted, stakes } = useApp();

  const leadingProposal = stakes.proposals.find(p => p.leading) ?? stakes.proposals[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Banner */}
        {!hasVoted ? (
          <TouchableOpacity
            style={styles.actionBannerDark}
            onPress={() => navigation.navigate('LeagueStakesFromInbox')}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconWrap}>
              <Text style={styles.actionIcon}>💀</Text>
            </View>
            <View style={styles.actionCenter}>
              <Text style={styles.actionTitleDark}>Vote on this week's punishment!</Text>
              <Text style={styles.actionSubDark}>"{leadingProposal?.text}"</Text>
            </View>
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionBannerLight}
            onPress={() => navigation.navigate('LeagueStakesFromInbox')}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.actionIcon}>🏆</Text>
            </View>
            <View style={styles.actionCenter}>
              <Text style={styles.actionTitleLight}>You voted on this week's stakes ✓</Text>
              <Text style={styles.actionSubLight}>See the current vote standings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}

        {/* Messages */}
        <Text style={styles.sectionLabel}>MESSAGES RECEIVED</Text>
        {notifications.messages.map(msg => (
          <View key={msg.id} style={styles.messageCard}>
            <Avatar initial={msg.initial} color={msg.color} size={40} />
            <View style={styles.messageContent}>
              <Text style={styles.messageSender}>{msg.from}</Text>
              <Text style={styles.messageText} numberOfLines={2}>{msg.text}</Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 40,
  },
  actionBannerDark: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.base,
    ...SHADOW,
  },
  actionBannerLight: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
    shadowOpacity: 0.04,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#3D3580',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 22,
  },
  actionCenter: {
    flex: 1,
  },
  actionTitleDark: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    marginBottom: 2,
  },
  actionSubDark: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.55)',
  },
  actionTitleLight: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  actionSubLight: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  actionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBadgeText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  sectionLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  messageCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: SPACING.sm,
    ...SHADOW,
  },
  messageContent: {
    flex: 1,
  },
  messageSender: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
  },
});
