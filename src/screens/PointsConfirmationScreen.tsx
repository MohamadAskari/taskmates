import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { members, currentUser } from '../data/mockData';
import { Member } from '../data/mockData';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';

const MEDALS = ['🥇', '🥈', '🥉'];

type RouteParams = {
  taskId: string;
  taskTitle: string;
  points: number;
};

export default function PointsConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { taskTitle, points } = route.params;
  const { memberPoints, addPointsToCurrentUser } = useApp();

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  // Snapshot points at mount with current user's new total already applied.
  // Frozen in useMemo so re-renders don't recalculate after context updates.
  const displayPoints = useMemo<Record<string, number>>(
    () => ({ ...memberPoints, [currentUser.id]: (memberPoints[currentUser.id] ?? currentUser.points) + points }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const ranked = useMemo<Member[]>(
    () => [...members].sort((a, b) => (displayPoints[b.id] ?? b.points) - (displayPoints[a.id] ?? a.points)),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    addPointsToCurrentUser(points);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.emoji}>🎉</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.pointsLabel}>+{points} pts</Text>
        </Animated.View>

        <Text style={styles.taskName}>"{taskTitle}" completed!</Text>

        {/* Rank list */}
        <Animated.View style={[styles.card, { opacity: listAnim }]}>
          <Text style={styles.cardLabel}>UPDATED STANDINGS</Text>

          {ranked.map((m, index) => {
            const pts = displayPoints[m.id] ?? m.points;
            const isCurrent = m.id === currentUser.id;
            const medal = MEDALS[index];

            return (
              <View key={m.id}>
                <View style={[styles.row, isCurrent && styles.rowHighlight]}>
                  {/* Rank */}
                  {medal ? (
                    <Text style={styles.medal}>{medal}</Text>
                  ) : (
                    <Text style={styles.rankNum}>{index + 1}</Text>
                  )}

                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: m.color }]}>
                    <Text style={styles.avatarText}>{m.initial}</Text>
                  </View>

                  {/* Name */}
                  <Text style={[styles.name, isCurrent && styles.nameCurrent]} numberOfLines={1}>
                    {m.name}
                    {isCurrent ? ' ✦' : ''}
                  </Text>

                  {/* Points + gain badge */}
                  <View style={styles.rightSide}>
                    {isCurrent && (
                      <View style={styles.gainBadge}>
                        <Text style={styles.gainBadgeText}>+{points}</Text>
                      </View>
                    )}
                    <Text style={[styles.pts, isCurrent && styles.ptsCurrent]}>{pts} pt</Text>
                  </View>
                </View>

                {index < ranked.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            );
          })}
        </Animated.View>

        <Text style={styles.keepGoing}>Keep going — you're on a roll! 🚀</Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>Back to tasks</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.base,
  },
  pointsLabel: {
    fontSize: 56,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  taskName: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  cardLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: SPACING.sm,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 10,
    borderRadius: RADIUS.sm,
  },
  rowHighlight: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  medal: {
    fontSize: 18,
    width: 26,
    textAlign: 'center',
  },
  rankNum: {
    width: 26,
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: 'rgba(255,255,255,0.75)',
  },
  nameCurrent: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gainBadge: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gainBadgeText: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  pts: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.65)',
    minWidth: 36,
    textAlign: 'right',
  },
  ptsCurrent: {
    color: '#FFFFFF',
  },
  keepGoing: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.semiBold,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  backBtn: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    height: 54,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
});
