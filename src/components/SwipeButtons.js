/**
 * src/components/SwipeButtons.js
 * ─────────────────────────────────────────────────────────
 * This component renders the three action buttons below the
 * swipe cards: Nope (✕), Super Like (★), and Like (♥).
 *
 * CONCEPT — Callback Props:
 *   The buttons themselves don't know what happens when pressed.
 *   The PARENT (SwipeScreen) decides what to do — it passes
 *   functions down as props (onNope, onLike).
 *   This pattern is called "lifting state up" — the child
 *   triggers, the parent acts.
 *
 *   Example:
 *     Parent calls:  <SwipeButtons onNope={handleNope} onLike={handleLike} />
 *     Child calls:   onPress={onNope}  → executes parent's handleNope()
 *
 * CONCEPT — Controlled vs Uncontrolled:
 *   These buttons are "controlled" — they have no internal state.
 *   All logic lives in SwipeScreen. Makes testing and debugging easier.
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../theme';

/**
 * SwipeButtons Component
 * @param {Function} onNope  - called when user taps the ✕ (dislike) button
 * @param {Function} onLike  - called when user taps the ♥ (like) button
 */
export default function SwipeButtons({ onNope, onLike }) {
  return (
    /**
     * Container uses flexDirection: 'row' so buttons sit side by side.
     * gap: Spacing.lg puts even space between them.
     */
    <View style={styles.container}>

      {/**
       * NOPE BUTTON — swipes the card to the LEFT
       * onPress calls the onNope prop passed from SwipeScreen,
       * which triggers swiperRef.current?.swipeLeft()
       */}
      <TouchableOpacity
        style={[styles.btn, styles.nopeBtn]} // Two styles merged into one via array
        onPress={onNope}
        activeOpacity={0.8} // Slightly dims button when pressed (0=invisible, 1=no change)
      >
        <Text style={styles.nopeIcon}>✕</Text>
      </TouchableOpacity>

      {/**
       * SUPER LIKE BUTTON — centre button (no swipe action in this prototype)
       * In a full app this would trigger a special "super like" interaction.
       * For now it's a visual placeholder to match the Tinder layout.
       */}
      <TouchableOpacity style={[styles.btn, styles.superBtn]} activeOpacity={0.8}>
        <Text style={styles.superIcon}>★</Text>
      </TouchableOpacity>

      {/**
       * LIKE BUTTON — swipes the card to the RIGHT
       * onPress calls the onLike prop → triggers swiperRef.current?.swipeRight()
       * Swipe right can trigger a match (50% probability in SwipeScreen).
       */}
      <TouchableOpacity
        style={[styles.btn, styles.likeBtn]}
        onPress={onLike}
        activeOpacity={0.8}
      >
        <Text style={styles.likeIcon}>♥</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',      // Horizontal layout
    justifyContent: 'center',  // Centre the row horizontally
    alignItems: 'center',      // Align buttons vertically in the middle
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  // Base button style shared by all three buttons
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full, // Perfect circle
    // Shadow effect
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  // Nope = red-tinted border, white background
  nopeBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  nopeIcon: {
    fontSize: 22,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  // Super like = grey, slightly smaller (feels secondary)
  superBtn: {
    width: 50,
    height: 50,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.greyMid,
  },
  superIcon: {
    fontSize: 20,
    color: Colors.grey,
  },
  // Like = solid red fill (most important action = most visual weight)
  likeBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.red,
  },
  likeIcon: {
    fontSize: 24,
    color: Colors.white,
  },
});
