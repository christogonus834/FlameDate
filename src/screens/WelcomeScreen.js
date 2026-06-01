import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius } from '../theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#111111', '#2a0008', '#111111']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <SafeAreaView style={styles.inner}>
        <Animated.View
          style={[
            styles.logoArea,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.flameBadge}>
            <Text style={styles.flameEmoji}>🔥</Text>
          </View>
          <Text style={styles.appName}>FlameDate</Text>
          <View style={styles.taglineRow}>
            <View style={styles.line} />
            <Text style={styles.tagline}>Find your spark</Text>
            <View style={styles.line} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.centerArea, { opacity: fadeAnim }]}>
          <Text style={styles.headline}>
            {"Real connections\nstart here."}
          </Text>
          <Text style={styles.subtext}>
            Swipe through curated profiles and find someone who truly matches your energy.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.ctaArea, { opacity: buttonAnim }]}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Swipe')}
          >
            <LinearGradient
              colors={[Colors.redLight, Colors.red, Colors.redDark]}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaText}>Start Discovering</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By continuing you agree to our <Text style={styles.termsLink}>Terms & Privacy</Text>
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  circleTop: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.redDark, opacity: 0.18, top: -100, right: -80,
  },
  circleBottom: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: Colors.red, opacity: 0.1, bottom: -60, left: -60,
  },
  logoArea: { alignItems: 'center', marginTop: Spacing.xl },
  flameBadge: {
    width: 72, height: 72, borderRadius: Radius.full,
    backgroundColor: 'rgba(232,25,44,0.15)', alignItems: 'center',
    justifyContent: 'center', marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: 'rgba(232,25,44,0.3)',
  },
  flameEmoji: { fontSize: 36 },
  appName: {
    fontFamily: Fonts.display, fontSize: 38, color: Colors.white,
    letterSpacing: 1, marginBottom: Spacing.sm,
  },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)', maxWidth: 60 },
  tagline: {
    fontFamily: Fonts.body, fontSize: 13, color: Colors.greyMid,
    letterSpacing: 2, textTransform: 'uppercase',
  },
  centerArea: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.sm },
  headline: {
    fontFamily: Fonts.display, fontSize: 40, color: Colors.white,
    lineHeight: 52, marginBottom: Spacing.md,
  },
  subtext: { fontFamily: Fonts.body, fontSize: 16, color: Colors.grey, lineHeight: 26 },
  ctaArea: { gap: Spacing.md },
  ctaButton: {
    borderRadius: Radius.full, overflow: 'hidden', elevation: 8,
    shadowColor: Colors.red, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 12,
  },
  ctaGradient: { paddingVertical: 18, alignItems: 'center' },
  ctaText: { fontFamily: Fonts.bodyBold, fontSize: 17, color: Colors.white, letterSpacing: 0.5 },
  termsText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.grey, textAlign: 'center' },
  termsLink: { color: Colors.greyMid, textDecorationLine: 'underline' },
});

