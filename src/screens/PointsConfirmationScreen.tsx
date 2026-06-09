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
import { members } from '../data/mockData';
import LeaderboardRow from '../components/LeaderboardRow';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import { HomeStackParamList, TasksStackParamList } from '../navigation/BottomTabNavigator';

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

  // Capture display values at mount — before addPointsToCurrentUser updates context.
  // This prevents the double-count that happens when the effect re-renders with the
  // already-updated memberPoints and then adds points a second time in the display.
  const displayPoints = useMemo<Record<string, number>>(
    () => ({ ...memberPoints, alex: (memberPoints['alex'] ?? 14) + points }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const maxPts = useMemo(
    () => Math.max(...members.map(m => displayPoints[m.id] ?? m.points)),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    addPointsToCurrentUser(points);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.emoji}>🎉</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.points}>+{points} pts</Text>
        </Animated.View>

        <Text style={styles.taskName}>{taskTitle} completed!</Text>

        {/* Updated leaderboard card */}
        <View style={styles.leaderboardCard}>
          <Text style={styles.leaderboardLabel}>UPDATED LEADERBOARD</Text>
          {members.map(m => (
            <LeaderboardRow
              key={m.id}
              member={m}
              isCurrentUser={m.id === 'alex'}
              maxPoints={maxPts}
              currentPoints={displayPoints[m.id] ?? m.points}
              darkMode
            />
          ))}
        </View>

        <Text style={styles.keepGoing}>Keep going — you're on a roll! 🚀</Text>

        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
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
  points: {
    fontSize: 56,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  taskName: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  leaderboardCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  leaderboardLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    textAlign: 'center',
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
