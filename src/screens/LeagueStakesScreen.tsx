import React from 'react';
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
import { useApp } from '../context/AppContext';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import ProgressBar from '../components/ProgressBar';

export default function LeagueStakesScreen() {
  const navigation = useNavigation<any>();
  const { stakes, voteOnStake } = useApp();

  const totalVotes = stakes.proposals.reduce((s, p) => s + p.votes, 0);
  const maxVotes = Math.max(...stakes.proposals.map(p => p.votes), 1);
  const hasVoted = !!stakes.userVotedFor;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <Text style={styles.subtitle}>Last place each week faces the punishment</Text>

        {/* Week Banner */}
        <View style={styles.weekCard}>
          <View style={styles.weekIconWrap}>
            <Text style={styles.weekIcon}>{hasVoted ? '🏆' : '💀'}</Text>
          </View>
          <View style={styles.weekCenter}>
            <Text style={styles.weekTitle}>Week of {stakes.week}</Text>
            {hasVoted ? (
              <Text style={styles.weekVotedText}>✓ Your vote is in · {totalVotes} total votes</Text>
            ) : (
              <Text style={styles.weekWarningText}>⚠ Your vote is needed · {totalVotes} votes so far</Text>
            )}
          </View>
          {!hasVoted && (
            <View style={styles.voteNowPill}>
              <Text style={styles.voteNowText}>Vote!</Text>
            </View>
          )}
        </View>

        {/* Proposals */}
        <Text style={styles.sectionLabel}>PROPOSALS</Text>

        {stakes.proposals.map(proposal => {
          const isVoted = stakes.userVotedFor === proposal.id;
          const pct = (proposal.votes / maxVotes) * 100;
          const isLeading = proposal.votes === maxVotes && proposal.votes > 0;

          return (
            <View
              key={proposal.id}
              style={[styles.proposalCard, isVoted && styles.proposalCardVoted]}
            >
              <View style={styles.proposalHeader}>
                {isLeading && (
                  <View style={styles.leadingBadge}>
                    <Text style={styles.leadingBadgeText}>LEADING</Text>
                  </View>
                )}
                <Text style={styles.proposalText}>{proposal.text}</Text>
                <Text style={styles.proposedBy}>Proposed by {proposal.proposedBy}</Text>
              </View>

              <View style={styles.proposalVoteRow}>
                <View style={styles.progressWrap}>
                  <ProgressBar
                    value={pct}
                    color={isVoted ? COLORS.primary : COLORS.textMuted}
                    height={6}
                    animated
                  />
                </View>
                <Text style={styles.voteCount}>{proposal.votes} votes</Text>
              </View>

              {isVoted ? (
                <View style={styles.yourVoteBtn}>
                  <Text style={styles.yourVoteBtnText}>👍 Your vote ✓</Text>
                </View>
              ) : stakes.userVotedFor ? (
                <TouchableOpacity
                  style={styles.switchVoteBtn}
                  onPress={() => voteOnStake(proposal.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.switchVoteBtnText}>👍 Switch my vote here</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.voteBtn}
                  onPress={() => voteOnStake(proposal.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.voteBtnText}>👍 Vote for this</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Propose card */}
        <TouchableOpacity
          style={styles.proposeCard}
          onPress={() => navigation.navigate('ProposeStakes')}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.proposeText}>+ Propose a punishment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
  },
  weekCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.base,
    ...SHADOW,
  },
  weekIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.darkCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekIcon: {
    fontSize: 22,
  },
  weekCenter: {
    flex: 1,
  },
  weekTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  weekWarningText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.orange,
  },
  weekVotedText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
  },
  voteNowPill: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  voteNowText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
  },
  sectionLabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  proposalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...SHADOW,
  },
  proposalCardVoted: {
    borderColor: COLORS.primary,
  },
  proposalHeader: {
    marginBottom: SPACING.sm,
  },
  leadingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  leadingBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: '#166534',
    letterSpacing: 0.5,
  },
  proposalText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  proposedBy: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  proposalVoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.sm,
  },
  progressWrap: {
    flex: 1,
  },
  voteCount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    minWidth: 50,
    textAlign: 'right',
  },
  voteBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  voteBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
  yourVoteBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
  },
  yourVoteBtnText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
  switchVoteBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  switchVoteBtnText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  proposeCard: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.sm,
  },
  proposeText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
});
