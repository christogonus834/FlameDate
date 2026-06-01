/**
 * src/screens/ProfileDetailScreen.js
 * ─────────────────────────────────────────────────────────
 * SCREEN 3 — Full profile view for a matched or selected profile.
 *
 * HOW THIS SCREEN IS REACHED:
 *   From SwipeScreen's MatchModal → user taps "View Profile"
 *   navigation.navigate('ProfileDetail', { profile: matchedProfile, isMatch: true })
 *
 * CONCEPTS USED HERE:
 *   • route.params    — how data is received from the previous screen
 *   • Animated API    — entrance animation (fade + slide up)
 *   • ScrollView      — allows content to scroll if it overflows the screen
 *   • Alert           — React Native's built-in popup dialog
 *   • SafeAreaView    — applied only to specific edges (top for hero, bottom for bar)
 *   • Pinned bottom bar — action buttons fixed to the bottom of the screen
 *
 * LAYOUT STRUCTURE:
 *   ┌─────────────────────────────────┐
 *   │   Hero Image (48% of height)   │  ← back button + match badge on top
 *   │   Name + Age overlaid          │
 *   ├─────────────────────────────────┤
 *   │   ScrollView content           │
 *   │     Location                   │
 *   │     About (bio)                │
 *   │     Interests chips            │
 *   │     Compatibility bar          │  ← NEW: shows match % with animated bar
 *   │     Match banner (if matched)  │  ← FIX: text now wraps inside the box
 *   │     Wave icebreaker button     │  ← NEW: lightweight alternative to message
 *   └─────────────────────────────────┘
 *   ┌─────────────────────────────────┐  ← fixed to bottom
 *   │  [♥]  [Send Message ───────]   │
 *   └─────────────────────────────────┘
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  Alert,       // Built-in dialog — shows a native OS popup
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius } from '../theme';

const { width, height } = Dimensions.get('window');

/**
 * ProfileDetailScreen Component
 * @param {Object} navigation — for goBack()
 * @param {Object} route      — contains route.params with profile + isMatch
 */
export default function ProfileDetailScreen({ navigation, route }) {
  /**
   * route.params — data passed from the previous screen via navigate().
   * We destructure profile and isMatch from it.
   * isMatch: true → shows the match banner, compatibility bar, and wave button
   * isMatch: false/undefined → shows profile without match UI
   */
  const { profile, isMatch } = route.params || {};

  // Entrance animations — same pattern as WelcomeScreen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current; // 60dp below, slides up to 0

  useEffect(() => {
    // Runs once on mount — triggers the content area to slide up and fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Safety guard — if navigated here without profile data, show an error view
  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.errorBack}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * handleMessage — fires when user taps "Send Message".
   * Alert.alert(title, message, buttons) shows a native OS dialog.
   * In a real app, this would open a chat screen or API call.
   */
  const handleMessage = () => {
    Alert.alert(
      '💬 Message Sent!',
      `Your message request has been sent to ${profile.name}. They'll get back to you soon!`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  /**
   * handleLike — fires when user taps the heart icon.
   * Confirms a super like action. In a real app, this would
   * update the server and potentially trigger a push notification.
   */
  const handleLike = () => {
    Alert.alert(
      '🔥 Super Liked!',
      `You super liked ${profile.name}!`,
      [{ text: 'Awesome!', style: 'default' }]
    );
  };

  /**
   * handleWave — fires when user taps "Send a Wave instead".
   * A wave is a lightweight icebreaker — lower commitment than a message.
   * In a real app this would send a push notification to the matched user.
   */
  const handleWave = () => {
    Alert.alert(
      '👋 Wave Sent!',
      `${profile.name} has been notified you waved!`,
      [{ text: 'Nice!', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── HERO IMAGE SECTION ── */}
      <View style={styles.heroWrapper}>
        <Image source={{ uri: profile.image }} style={styles.heroImage} resizeMode="cover" />

        {/* Gradient overlay over the hero image for readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.3)']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/**
         * SafeAreaView with edges={['top']} only — respects the
         * status bar/notch at the top but not the bottom.
         * We put the back button and match badge here so they
         * don't go behind the notch.
         */}
        <SafeAreaView style={styles.heroTopBar} edges={['top']}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()} // Pop this screen off the stack
            activeOpacity={0.8}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/**
           * Conditional rendering — only shows the match badge if
           * the user arrived here via a match (isMatch === true).
           * The && operator: if left side is true, render the right side.
           */}
          {isMatch && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>🔥 It's a Match!</Text>
            </View>
          )}
        </SafeAreaView>

        {/* Name + age overlaid on the bottom of the hero image */}
        <View style={styles.heroBottom}>
          <Text style={styles.heroName}>{profile.name}</Text>
          <Text style={styles.heroAge}>{profile.age}</Text>
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT SECTION ── */}
      {/**
       * Animated.View wraps the content so it can slide up on mount.
       * opacity and translateY are driven by our animation values.
       */}
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/**
         * ScrollView allows the content to scroll vertically if
         * it's taller than the available space.
         * showsVerticalScrollIndicator={false} hides the scrollbar line.
         * contentContainerStyle applies padding inside the scroll area.
         */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Location */}
          <View style={styles.locationRow}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>

          {/* Horizontal divider line */}
          <View style={styles.divider} />

          {/* About / Bio section */}
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          {/* Interests section */}
          <Text style={styles.sectionLabel}>Interests</Text>
          <View style={styles.chips}>
            {/**
             * Render ALL interests here (no .slice limit like the card).
             * The detail screen has more space, so we show everything.
             */}
            {profile.interests.map((tag) => (
              <View key={tag} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/**
           * Match-only section — all three blocks below are only rendered
           * when isMatch === true (user arrived here from a swipe match).
           */}
          {isMatch && (
            <>
              {/**
               * ── COMPATIBILITY SCORE BAR ── (NEW)
               *
               * Shows a visual percentage bar representing how well the two
               * profiles match. The value comes from profile.compatibility —
               * add this field to your mock data in src/data/profiles.js
               * (e.g. compatibility: 87). Falls back to 87 if not set.
               *
               * The fill bar uses an inline width style (percentage string)
               * so it stretches proportionally inside the track.
               * e.g. { width: '87%' } fills 87% of the grey track.
               */}
              <View style={styles.compatBox}>
                <View style={styles.compatHeader}>
                  <Text style={styles.compatLabel}>🔥 Compatibility</Text>
                  <Text style={styles.compatPercent}>
                    {profile.compatibility ?? 87}%
                  </Text>
                </View>
                {/* Grey track — the background of the progress bar */}
                <View style={styles.compatTrack}>
                  {/* Red fill — width is set inline as a percentage string */}
                  <View
                    style={[
                      styles.compatFill,
                      { width: `${profile.compatibility ?? 87}%` },
                    ]}
                  />
                </View>
              </View>

              {/**
               * ── MATCH CONFIRMATION BANNER ── (FIXED)
               *
               * FIX: The inner <View> now has flex: 1 (matchBannerText style).
               * Previously, the text container had no width constraint, so the
               * subtitle "Send a message to start the conversation" overflowed
               * outside the banner box.
               *
               * flex: 1 tells the text container to only take the remaining
               * space after the emoji, forcing text to wrap within the box.
               */}
              <View style={styles.matchBanner}>
                <Text style={styles.matchBannerEmoji}>🔥</Text>
                {/**
                 * matchBannerText has flex: 1 — this is the key fix.
                 * Without it, the View has no width limit and text escapes
                 * the banner. With flex: 1, it fills remaining space only.
                 */}
                <View style={styles.matchBannerText}>
                  <Text style={styles.matchBannerTitle}>
                    You matched with {profile.name}!
                  </Text>
                  <Text style={styles.matchBannerSub}>
                    Send a message to start the conversation
                  </Text>
                </View>
              </View>

              {/**
               * ── WAVE ICEBREAKER BUTTON ── (NEW)
               *
               * A ghost/outline button as a lower-commitment alternative
               * to "Send Message". Tapping it fires handleWave which shows
               * an Alert — in a real app this would send a push notification.
               *
               * Design: outline only (no fill), red border and text.
               * Keeps the screen minimal while adding a creative touch.
               */}
              <TouchableOpacity
                style={styles.waveBtn}
                activeOpacity={0.8}
                onPress={handleWave}
              >
                <Text style={styles.waveBtnText}>👋  Send a Wave instead</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Bottom padding so content isn't hidden behind the fixed action bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

      {/* ── PINNED ACTION BAR (fixed at bottom) ── */}
      {/**
       * SafeAreaView with edges={['bottom']} respects the home indicator
       * bar at the bottom of notched phones (iPhone X+, modern Androids).
       * position: 'absolute' + bottom: 0 keeps this bar fixed to the
       * bottom even when the ScrollView scrolls.
       */}
      <SafeAreaView style={styles.actionBar} edges={['bottom']}>
        {/* Heart / like button — circular, secondary action */}
        <TouchableOpacity style={styles.likeBtn} onPress={handleLike} activeOpacity={0.85}>
          <Text style={styles.likeBtnIcon}>♥</Text>
        </TouchableOpacity>

        {/* Message button — wide, primary action */}
        <TouchableOpacity style={styles.messageBtn} onPress={handleMessage} activeOpacity={0.85}>
          <LinearGradient
            colors={[Colors.redLight, Colors.red]}
            style={styles.messageBtnGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.messageBtnText}>Send Message</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  // Error fallback UI
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.grey,
  },
  errorBack: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.red,
  },
  // Hero image block — takes up 48% of screen height
  heroWrapper: {
    height: height * 0.48,
    position: 'relative', // Needed so absolute children (back btn, name) position inside it
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  // Top bar inside the hero (back button + match badge)
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent so image shows through
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '600',
  },
  matchBadge: {
    backgroundColor: Colors.red,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  matchBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.white,
  },
  // Name + age at the bottom of the hero image
  heroBottom: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  heroName: {
    fontFamily: Fonts.display,
    fontSize: 38,
    color: Colors.white,
  },
  heroAge: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 26,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  // Content area below the hero
  contentWrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  locationPin: { fontSize: 14 },
  locationText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.grey,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.greyLight,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.grey,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  bio: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.greyDark,
    lineHeight: 26,
    marginBottom: Spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    backgroundColor: Colors.greyLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.greyMid,
  },
  chipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.greyDark,
  },

  // ── COMPATIBILITY BOX (NEW) ──────────────────────────────
  // Card that holds the label, percentage, and progress bar
  compatBox: {
    backgroundColor: '#FFF0F2',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(232,25,44,0.2)',
    marginBottom: Spacing.md,
  },
  // Row with "🔥 Compatibility" on the left and "87%" on the right
  compatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  compatLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.redDark,
  },
  compatPercent: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.red,
  },
  // Grey background track of the progress bar
  compatTrack: {
    height: 6,
    backgroundColor: 'rgba(232,25,44,0.15)',
    borderRadius: Radius.full,
    overflow: 'hidden', // Clips the red fill to the rounded track shape
  },
  // Red fill — width is set inline as a percentage string (e.g. '87%')
  compatFill: {
    height: '100%',
    backgroundColor: Colors.red,
    borderRadius: Radius.full,
  },

  // ── MATCH CONFIRMATION BANNER (FIXED) ───────────────────
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#FFF0F2',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(232,25,44,0.2)',
    marginBottom: Spacing.sm,
  },
  matchBannerEmoji: { fontSize: 32 },
  /**
   * THE FIX — flex: 1 constrains this container to the remaining
   * width after the emoji, so text wraps inside instead of overflowing.
   */
  matchBannerText: {
    flex: 1,
  },
  matchBannerTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: Colors.redDark,
  },
  matchBannerSub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.grey,
    marginTop: 2,
  },

  // ── WAVE ICEBREAKER BUTTON (NEW) ────────────────────────
  // Ghost/outline style — no fill, just a red border and red text.
  // Sits below the match banner as a softer alternative to messaging.
  waveBtn: {
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(232,25,44,0.4)',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  waveBtnText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.red,
    letterSpacing: 0.3,
  },

  // ── FIXED ACTION BAR ────────────────────────────────────
  // position: 'absolute' + bottom: 0 pins this bar to the screen bottom
  // regardless of scroll position. SafeAreaView handles the home indicator.
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.white,
    gap: Spacing.md,
    // Top border separator
    borderTopWidth: 1,
    borderTopColor: Colors.greyLight,
    // Shadow above the bar
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  likeBtn: {
    width: 54,
    height: 54,
    borderRadius: Radius.full,
    backgroundColor: Colors.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.greyMid,
  },
  likeBtnIcon: {
    fontSize: 22,
    color: Colors.red,
  },
  messageBtn: {
    flex: 1,              // Takes all remaining width after the like button
    borderRadius: Radius.full,
    overflow: 'hidden',   // Clips gradient to pill shape
  },
  messageBtnGrad: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  messageBtnText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.white,
  },
});