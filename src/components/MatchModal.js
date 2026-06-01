/**
 * src/components/MatchModal.js
 * ─────────────────────────────────────────────────────────
 * This component is the "It's a Match!" celebration popup.
 * It appears as an overlay on top of the SwipeScreen when
 * a match is triggered (50% random chance on swipe right).
 *
 * CONCEPT — Modal:
 *   A Modal is a UI element that overlays the current screen.
 *   React Native has a built-in <Modal> component that handles
 *   this natively. We use `transparent={true}` so the screen
 *   behind shows through (with a dark overlay on top).
 *
 * CONCEPT — Animated API:
 *   React Native's built-in Animated library lets us create
 *   smooth transitions by interpolating values over time.
 *   We use:
 *     • Animated.Value  → a mutable number that drives animations
 *     • Animated.spring → physics-based spring animation (bouncy feel)
 *     • Animated.timing → linear time-based animation
 *     • Animated.parallel → runs multiple animations at the same time
 *   useNativeDriver: true → runs animation on the GPU thread (smooth, no JS lag)
 *
 * CONCEPT — useRef:
 *   useRef stores a value that PERSISTS between re-renders but
 *   does NOT cause a re-render when changed. Perfect for animation
 *   values, which change every frame but shouldn't re-render the component.
 *
 * CONCEPT — useEffect:
 *   useEffect runs AFTER the component renders.
 *   The [visible] dependency means: "run this effect whenever
 *   the `visible` prop changes". So when the modal becomes visible,
 *   we trigger the entrance animation.
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius } from '../theme';

const { width } = Dimensions.get('window');

/**
 * MatchModal Component
 * @param {boolean}  visible       - whether the modal is shown
 * @param {Object}   profile       - the matched profile to display
 * @param {Function} onClose       - called when user taps "Keep Swiping"
 * @param {Function} onViewProfile - called when user taps "View Profile"
 */
export default function MatchModal({ visible, profile, onClose, onViewProfile }) {
  /**
   * useRef() creates persistent animation values.
   * Initial value 0.5 = card starts at half-size (for a zoom-in effect).
   * Initial value 0   = card starts invisible (opacity 0).
   */
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  /**
   * useEffect — triggers animation when `visible` changes.
   * When visible becomes TRUE  → play entrance animation.
   * When visible becomes FALSE → reset values for next time.
   */
  useEffect(() => {
    if (visible) {
      // Run scale + fade animations simultaneously
      Animated.parallel([
        // Spring animation: bounces naturally, like a physical spring
        // tension: how stiff the spring is (higher = faster)
        // friction: how much damping (lower = more bouncy)
        Animated.spring(scaleAnim, {
          toValue: 1,           // Animate TO full size (scale: 1)
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        // Timing animation: fades in over 300ms
        Animated.timing(opacityAnim, {
          toValue: 1,           // Animate TO fully visible (opacity: 1)
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(); // .start() begins the animation
    } else {
      // Reset for next time modal opens (important! otherwise it
      // would start at scale 1 and skip the entrance animation)
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [visible]); // Dependency array — re-run effect when `visible` changes

  // Guard: if no profile data, render nothing (avoids crash)
  if (!profile) return null;

  return (
    /**
     * React Native's built-in Modal component.
     * transparent={true}  → background shows through
     * animationType="fade" → the overlay fades in (the card uses our custom animation)
     * onRequestClose → called when user presses Android back button
     */
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Semi-transparent dark overlay covering the whole screen */}
      <View style={styles.overlay}>

        {/**
         * Animated.View wraps the card so it can be animated.
         * We apply both opacity and scale transforms.
         * transform is an array — React Native supports multiple transforms.
         */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,                  // 0 → 1 (fade in)
              transform: [{ scale: scaleAnim }],     // 0.5 → 1 (zoom in)
            },
          ]}
        >
          {/* Dark red gradient card background */}
          <LinearGradient
            colors={['#1a0005', '#2d000d', '#111111']}
            style={StyleSheet.absoluteFillObject} // Fills entire parent absolutely
            borderRadius={Radius.xl}
          />

          {/* Content — stacked vertically (default flexDirection: 'column') */}
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.matchTitle}>It's a Match!</Text>
          <Text style={styles.matchSub}>
            You and {profile.name} liked each other
          </Text>

          {/**
           * Profile image with a red circular border.
           * The border is a separate View positioned absolutely
           * around the image — a common trick since Image doesn't
           * support borderColor + borderRadius well on all platforms.
           */}
          <View style={styles.imageWrapper}>
            <Image source={{ uri: profile.image }} style={styles.image} />
            <View style={styles.imageBorder} />
          </View>

          <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
          <Text style={styles.profileLocation}>📍 {profile.location}</Text>

          {/* Action buttons */}
          <View style={styles.buttons}>
            {/* Primary CTA — takes user to Profile Detail Screen */}
            <TouchableOpacity
              style={styles.viewBtn}
              activeOpacity={0.85}
              onPress={onViewProfile} // Navigates away and closes modal
            >
              <LinearGradient
                colors={[Colors.redLight, Colors.red]}
                style={styles.viewBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} // Horizontal gradient (left to right)
              >
                <Text style={styles.viewBtnText}>View Profile</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary CTA — dismisses modal and keeps swiping */}
            <TouchableOpacity style={styles.continueBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.continueBtnText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)', // Very dark semi-transparent overlay
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: width * 0.88,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',      // Centre all children horizontally
    overflow: 'hidden',         // Clip gradient to rounded corners
    borderWidth: 1,
    borderColor: 'rgba(232,25,44,0.25)', // Subtle red border glow
  },
  flame: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  matchTitle: {
    fontFamily: Fonts.display,
    fontSize: 34,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  matchSub: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.grey,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  imageWrapper: {
    position: 'relative', // Needed so the border View can absolute-position inside
    marginBottom: Spacing.md,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60, // Half of width/height = circle
  },
  imageBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 63,   // Slightly larger radius than the image (60 + 3)
    borderWidth: 3,
    borderColor: Colors.red,
  },
  profileName: {
    fontFamily: Fonts.display,
    fontSize: 24,
    color: Colors.white,
    marginBottom: 4,
  },
  profileLocation: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.grey,
    marginBottom: Spacing.xl,
  },
  buttons: {
    width: '100%',
    gap: Spacing.sm,
  },
  viewBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden', // Clips LinearGradient to pill shape
  },
  viewBtnGrad: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  viewBtnText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.white,
  },
  continueBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  continueBtnText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.grey,
  },
});
