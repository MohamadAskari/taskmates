import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { members, leagueName, currentUser } from '../data/mockData';
import { Member } from '../data/mockData';
import CheerModal from '../components/CheerModal';
import Toast from '../components/Toast';
import { COLORS, SHADOW } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';

const MEDAL_COLORS = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' } as const;
const PLATFORM_HEIGHTS = { 1: 60, 2: 44, 3: 32 } as const;
const AVATAR_SIZES = { 1: 72, 2: 60, 3: 60 } as const;
const INITIAL_FONT_SIZES = { 1: 26, 2: 22, 3: 22 } as const;

interface PodiumColumnProps {
  member: Member;
  rank: 1 | 2 | 3;
  scale: Animated.Value;
  isCurrentUser: boolean;
  points: number;
  onPress: () => void;
}

function PodiumColumn({ member, rank, scale, isCurrentUser, points, onPress }: PodiumColumnProps) {
  const medalColor = MEDAL_COLORS[rank];
  const avatarSize = AVATAR_SIZES[rank];
  const badgeTextColor = rank === 1 ? '#1A1A1A' : '#FFFFFF';

  return (
    <Animated.View style={[styles.podiumColumn, { transform: [{ scale }] }]}>
      {rank === 1 && <Text style={styles.crown}>👑</Text>}
      <TouchableOpacity
        onPress={isCurrentUser ? undefined : onPress}
        activeOpacity={isCurrentUser ? 1 : 0.75}
        disabled={isCurrentUser}
      >
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.podiumAvatar,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: member.color,
                borderColor: isCurrentUser ? 'rgba(255,255,255,0.5)' : medalColor,
              },
            ]}
          >
            <Text style={[styles.podiumAvatarInitial, { fontSize: INITIAL_FONT_SIZES[rank] }]}>
              {member.initial}
            </Text>
          </View>
          <View style={[styles.podiumRankBadge, { backgroundColor: medalColor }]}>
            <Text style={[styles.podiumRankBadgeText, { color: badgeTextColor }]}>{rank}</Text>
          </View>
          {!isCurrentUser && (
            <View style={styles.podiumCheerBadge}>
              <Ionicons name="heart" size={8} color="#FFFFFF" />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.podiumName} numberOfLines={1}>
        {member.name}{isCurrentUser ? ' ✦' : ''}
      </Text>
      <Text style={styles.podiumPoints}>{points} pt</Text>
      <View style={[styles.platform, { height: PLATFORM_HEIGHTS[rank] }]} />
    </Animated.View>
  );
}

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const { memberPoints } = useApp();
  const [cheerTarget, setCheerTarget] = useState<Member | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const sorted = [...members].sort(
    (a, b) => (memberPoints[b.id] ?? b.points) - (memberPoints[a.id] ?? a.points),
  );

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const rank1 = top3[0] as Member | undefined;
  const rank2 = top3[1] as Member | undefined;
  const rank3 = top3[2] as Member | undefined;

  const scaleRank1 = useRef(new Animated.Value(0.85)).current;
  const scaleRank2 = useRef(new Animated.Value(0.85)).current;
  const scaleRank3 = useRef(new Animated.Value(0.85)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.spring(scaleRank3, { toValue: 1, damping: 15, stiffness: 120, useNativeDriver: true }),
      Animated.spring(scaleRank2, { toValue: 1, damping: 15, stiffness: 120, useNativeDriver: true }),
      Animated.spring(scaleRank1, { toValue: 1, damping: 15, stiffness: 120, useNativeDriver: true }),
    ]).start();

    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 300,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const getPoints = (m: Member) => memberPoints[m.id] ?? m.points;

  const handleCheer = (member: Member) => {
    if (member.id === currentUser.id) return;
    setCheerTarget(member);
  };

  const handleCheerSend = (message: string) => {
    const name = cheerTarget?.name ?? '';
    setCheerTarget(null);
    setToastMsg(`Cheer sent to ${name}! 🎉`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6C5FD4', '#5B4FCF']}
        style={[styles.gradient, { paddingTop: insets.top + SPACING.base }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.leagueLabel}>{leagueName}</Text>
          <Text style={styles.screenTitle}>Leaderboard</Text>
          <View style={styles.cheerHint}>
            <Ionicons name="chatbubble-ellipses-outline" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={styles.cheerHintText}>Tap someone to send a cheer</Text>
          </View>
        </View>

        {top3.length > 0 && (
          <View style={styles.podiumRow}>
            {rank2 ? (
              <PodiumColumn
                member={rank2}
                rank={2}
                scale={scaleRank2}
                isCurrentUser={rank2.id === currentUser.id}
                points={getPoints(rank2)}
                onPress={() => handleCheer(rank2)}
              />
            ) : (
              <View style={styles.podiumColumn} />
            )}
            {rank1 && (
              <PodiumColumn
                member={rank1}
                rank={1}
                scale={scaleRank1}
                isCurrentUser={rank1.id === currentUser.id}
                points={getPoints(rank1)}
                onPress={() => handleCheer(rank1)}
              />
            )}
            {rank3 ? (
              <PodiumColumn
                member={rank3}
                rank={3}
                scale={scaleRank3}
                isCurrentUser={rank3.id === currentUser.id}
                points={getPoints(rank3)}
                onPress={() => handleCheer(rank3)}
              />
            ) : (
              <View style={styles.podiumColumn} />
            )}
          </View>
        )}
      </LinearGradient>

      <Animated.View style={[styles.listContainer, { opacity: listOpacity }]}>
        <FlatList
          data={rest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item, index }) => {
            const rank = index + 4;
            const pts = getPoints(item);
            const isCurrent = item.id === currentUser.id;
            return (
              <TouchableOpacity
                activeOpacity={isCurrent ? 1 : 0.7}
                disabled={isCurrent}
                style={styles.listRow}
                onPress={() => handleCheer(item)}
              >
                <Text style={styles.listRankText}>{rank}</Text>
                <View style={[styles.listAvatar, { backgroundColor: item.color }]}>
                  <Text style={styles.listAvatarInitial}>{item.initial}</Text>
                </View>
                <Text style={styles.listName} numberOfLines={1}>
                  {item.name}
                  {isCurrent && <Text style={{ color: COLORS.primary }}>{' ✦'}</Text>}
                </Text>
                <Text style={styles.listPoints}>{pts}pt</Text>
                {!isCurrent && (
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.textMuted} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </Animated.View>

      <CheerModal
        visible={!!cheerTarget}
        member={cheerTarget}
        onClose={() => setCheerTarget(null)}
        onSend={handleCheerSend}
      />

      {toastMsg && <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  gradient: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerContent: {
    marginBottom: SPACING.lg,
  },
  leagueLabel: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  cheerHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cheerHintText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.6)',
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  crown: {
    fontSize: 20,
    marginBottom: 4,
    textAlign: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  podiumAvatar: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumAvatarInitial: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
  },
  podiumRankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumRankBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  podiumCheerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumName: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  podiumPoints: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 10,
  },
  platform: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  listContent: {
    padding: SPACING.base,
  },
  listRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.card,
    paddingVertical: 14,
    paddingHorizontal: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  listRankText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: '#9B9B9B',
    width: 24,
    textAlign: 'center',
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listAvatarInitial: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  listName: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: '#1A1A1A',
  },
  listPoints: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#1A1A1A',
  },
});
