import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Member } from '../data/mockData';
import Avatar from './Avatar';
import ProgressBar from './ProgressBar';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';

const MEDALS = ['🥇', '🥈', '🥉'];

interface LeaderboardRowProps {
  member: Member;
  isCurrentUser: boolean;
  maxPoints: number;
  onPress?: () => void;
  currentPoints?: number;
  darkMode?: boolean;
}

export default function LeaderboardRow({
  member,
  isCurrentUser,
  maxPoints,
  onPress,
  currentPoints,
  darkMode = false,
}: LeaderboardRowProps) {
  const pts = currentPoints ?? member.points;
  const pct = maxPoints > 0 ? (pts / maxPoints) * 100 : 0;
  const medal = MEDALS[member.rank - 1] ?? '🏅';

  const nameColor = darkMode ? COLORS.white : COLORS.textPrimary;
  const ptsColor = darkMode ? COLORS.white : COLORS.textSecondary;
  const trackColor = darkMode ? 'rgba(255,255,255,0.15)' : COLORS.border;

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={isCurrentUser ? undefined : onPress}
      activeOpacity={isCurrentUser ? 1 : 0.7}
      disabled={isCurrentUser}
    >
      <Text style={styles.medal}>{medal}</Text>
      <Avatar initial={member.initial} color={member.color} size={36} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: nameColor }]}>
          {member.name}
          {isCurrentUser ? '  ✦' : ''}
        </Text>
        <ProgressBar value={pct} color={member.color} height={6} trackColor={trackColor} />
      </View>
      <Text style={[styles.pts, { color: ptsColor }]}>{pts}pt</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  medal: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.sm,
  },
  pts: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.sm,
    minWidth: 32,
    textAlign: 'right',
  },
});
