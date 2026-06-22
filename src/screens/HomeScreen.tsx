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
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { members, leagueName, currentUser } from '../data/mockData';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import { HomeStackParamList } from '../navigation/BottomTabNavigator';

type HomeNavProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

const MEDALS = ['🥇', '🥈', '🥉'];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const { tasks, markTaskDone, stakes, memberPoints, hasVoted } = useApp();

  // // Empty AsyncStorage on initial render
  // React.useEffect(() => {
  //   (async () => {
  //     try {
  //       const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  //       await AsyncStorage.clear();
  //       console.log('AsyncStorage emptied');
  //     } catch (err) {
  //       console.error('Failed to empty AsyncStorage', err);
  //     }
  //   })();
  // }, []);

  const pendingTasks = [...tasks].reverse().filter(t => !t.done).slice(0, 3);
  const leadingProposal = stakes.proposals.find(p => p.leading) ?? stakes.proposals[0];

  const top3Members = [...members]
    .sort((a, b) => (memberPoints[b.id] ?? b.points) - (memberPoints[a.id] ?? a.points))
    .slice(0, 3);

  const handleMarkDone = (taskId: string, taskTitle: string, points: number) => {
    markTaskDone(taskId);
    navigation.navigate('PointsConfirmation', { taskId, taskTitle, points });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.leagueName}>{leagueName}</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#1 Rank</Text>
          </View>
        </View>
        <Text style={styles.greeting}>Hey {currentUser.name} 👋</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Leaderboard Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>LEAGUE STANDING</Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Leaderboard')}>
              <Text style={styles.goToLeaderboard}>Go to leaderboard →</Text>
            </TouchableOpacity>
          </View>
          {top3Members.map((m, index) => {
            const pts = memberPoints[m.id] ?? m.points;
            const isCurrentUser = m.id === currentUser.id;
            const isLast = index === top3Members.length - 1;
            return (
              <View key={m.id}>
                <View style={styles.leaderRow}>
                  <Text style={styles.leaderMedal}>{MEDALS[index]}</Text>
                  <View style={[styles.leaderAvatar, { backgroundColor: m.color }]}>
                    <Text style={styles.leaderAvatarText}>{m.initial}</Text>
                  </View>
                  <Text style={styles.leaderName} numberOfLines={1}>
                    {m.name}
                    {isCurrentUser && <Text style={{ color: COLORS.primary }}>{' ✦'}</Text>}
                  </Text>
                  <Text style={styles.leaderPoints}>{pts}pt</Text>
                </View>
                {!isLast && <View style={styles.leaderSeparator} />}
              </View>
            );
          })}
        </View>

        {/* Stakes Banner */}
        {!hasVoted ? (
          <TouchableOpacity
            style={styles.stakesBanner}
            onPress={() => navigation.navigate('LeagueStakes')}
            activeOpacity={0.85}
          >
            <View style={styles.stakesIconWrap}>
              <Text style={styles.stakesIcon}>💀</Text>
            </View>
            <View style={styles.stakesCenter}>
              <Text style={styles.stakesLabel}>THIS WEEK'S STAKES</Text>
              <Text style={styles.stakesProposal} numberOfLines={1}>
                "{leadingProposal?.text}"
              </Text>
              <Text style={styles.stakesVotes}>
                {stakes.proposals.reduce((s, p) => s + p.votes, 0)} votes · {stakes.proposals.length} proposals
              </Text>
            </View>
            <TouchableOpacity
              style={styles.votePill}
              onPress={() => navigation.navigate('LeagueStakes')}
              activeOpacity={0.8}
            >
              <Text style={styles.votePillText}>Vote!</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stakesBannerVoted}
            onPress={() => navigation.navigate('LeagueStakes')}
            activeOpacity={0.85}
          >
            <View style={[styles.stakesIconWrapVoted, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.stakesIcon}>🏆</Text>
            </View>
            <View style={styles.stakesCenter}>
              <Text style={styles.stakesProposalVoted}>You voted on this week's stakes ✓</Text>
              <Text style={styles.stakesVotesVoted}>See the current vote standings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksSectionHeader}>
            <Text style={styles.tasksSectionTitle}>Your tasks</Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Tasks')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {pendingTasks.length === 0 ? (
            <View style={styles.emptyTasks}>
              <Text style={styles.emptyTasksText}>All caught up! 🎉</Text>
            </View>
          ) : (
            pendingTasks.map(task => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskLeft}>
                  <View style={styles.taskDot} />
                  <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                </View>
                <TouchableOpacity
                  style={styles.markDoneBtn}
                  onPress={() => handleMarkDone(task.id, task.title, task.points)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.markDoneBtnText}>Mark done</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating + button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.getParent()?.navigate('Tasks', { screen: 'AddTask' })}
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
    backgroundColor: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  leagueName: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  rankText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
  },
  greeting: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    ...SHADOW,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  cardLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  goToLeaderboard: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  leaderMedal: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  leaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  leaderAvatarText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  leaderName: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
  },
  leaderPoints: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#1A1A1A',
  },
  leaderSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  stakesBanner: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.base,
    ...SHADOW,
  },
  stakesBannerVoted: {
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
  stakesIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#3D3580',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stakesIcon: {
    fontSize: 22,
  },
  stakesCenter: {
    flex: 1,
  },
  stakesLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  stakesProposal: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    marginBottom: 2,
  },
  stakesProposalVoted: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  stakesIconWrapVoted: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stakesVotes: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.5)',
  },
  stakesVotesVoted: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  votePill: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  votePillText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
  },
  tasksSection: {
    marginBottom: SPACING.base,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  tasksSectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
  },
  seeAll: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
  taskCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    ...SHADOW,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
  },
  taskTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    flex: 1,
  },
  markDoneBtn: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
  },
  markDoneBtnText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xs,
  },
  emptyTasks: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW,
  },
  emptyTasksText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
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
