import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../theme/colors';
import { FONTS, FONT_SIZES } from '../theme/typography';
import { SPACING, RADIUS } from '../theme/spacing';
import { getSession, setSession } from '../storage/storage';

const VALID_CODE = 'SUNDAY42';

type SplashScreenNavProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavProp;
}

export default function SplashScreen({ navigation }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSession().then(session => {
      if (session?.joined) navigation.replace('Main');
    });
  }, []);

  const handleCreate = () => {
    // Coming soon — joining by code is the only path for now
  };

  const handleJoin = async () => {
    if (!code.trim()) return;
    if (code.trim().toUpperCase() !== VALID_CODE) {
      setError('Invalid code. Try SUNDAY42.');
      return;
    }
    await setSession({ joined: true });
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.decoCircle1} />
      <View style={styles.decoCircle2} />

      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroArea}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconEmoji}>⚡</Text>
            </View>
            <Text style={styles.appName}>JawaScript</Text>
            <Text style={styles.tagline}>do things. together.</Text>
          </View>

          <View style={styles.actionsArea}>
            <TouchableOpacity style={[styles.createBtn, styles.createBtnDisabled]} onPress={handleCreate} activeOpacity={0.6}>
              <Text style={styles.createBtnText}>Create a league</Text>
              <Text style={styles.createBtnSoon}>(coming soon)</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or join with a code</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.joinRow}>
              <TextInput
                style={styles.joinInput}
                placeholder="e.g. SUNDAY42"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={code}
                onChangeText={text => { setCode(text); setError(''); }}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.joinBtn} onPress={handleJoin} activeOpacity={0.8}>
                <Text style={styles.joinBtnText}>Join</Text>
              </TouchableOpacity>
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  decoCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.15,
    top: -60,
    right: -60,
  },
  decoCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.15,
    top: 60,
    right: 80,
  },
  inner: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
  },
  heroArea: {
    alignItems: 'center',
    paddingTop: 80,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  iconEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.75)',
  },
  actionsArea: {
    paddingBottom: SPACING.xl,
    gap: SPACING.base,
  },
  createBtn: {
    backgroundColor: COLORS.white,
    height: 54,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.5)',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
  },
  joinRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  joinInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    height: 50,
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
  },
  joinBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.md,
  },
  createBtnDisabled: {
    opacity: 0.6,
    flexDirection: 'row',
    gap: 6,
  },
  createBtnSoon: {
    color: COLORS.primary,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    opacity: 0.7,
  },
  errorText: {
    color: '#FFD0D0',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginTop: 4,
  },
});
