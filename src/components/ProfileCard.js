/**
 * src/components/ProfileCard.js
 * ─────────────────────────────────────────────────────────
 * This is a REUSABLE component — it renders one profile card.
 * The SwipeScreen feeds each profile from the data array into
 * this component one at a time via the `profile` prop.
 *
 * CONCEPT — Props:
 *   Props are how a parent component passes data DOWN to a child.
 *   Here, SwipeScreen is the parent. It calls:
 *     <ProfileCard profile={someProfileObject} />
 *   This component receives that object and displays it.
 *
 * CONCEPT — Reusability:
 *   Because the card is its own component, SwipeScreen doesn't
 *   need to know anything about how a card looks. It just passes
 *   data in. This keeps code clean and easy to change.
 *
 * VISUAL STRUCTURE (bottom to top, since we use absolute positioning):
 *   ┌─────────────────────┐
 *   │   Profile Photo     │  ← fills the entire card
 *   │                     │
 *   │▓▓▓▓ gradient ▓▓▓▓▓▓│  ← dark fade from bottom up (so text is readable)
 *   │  Name   Age         │
 *   │  📍 Location        │
 *   │  Bio text...        │
 *   │  [Tag] [Tag] [Tag]  │  ← interest chips
 *   └─────────────────────┘
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius } from '../theme';

// Dimensions.get('window') gives us the real screen width and height
// in density-independent pixels (dp). We use this to size the card
// relative to the screen — so it looks right on ALL phone sizes.
const { width, height } = Dimensions.get('window');

// We export CARD_WIDTH and CARD_HEIGHT so the SwipeScreen can
// reference them when laying out the swiper container.
// 88% of screen width keeps a nice margin on both sides.
export const CARD_WIDTH = width * 0.88;
export const CARD_HEIGHT = height * 0.62;

/**
 * ProfileCard Component
 * @param {Object} profile - a single profile object from profiles.js
 */
export default function ProfileCard({ profile }) {
  return (
    <View style={styles.card}>

      {/**
       * Profile photo — fills the entire card using absolute positioning.
       * `resizeMode="cover"` means the image scales to fill the box
       * while keeping its aspect ratio (may crop edges — like CSS object-fit: cover).
       */}
      <Image
        source={{ uri: profile.image }} // uri = a URL string (not a local file)
        style={styles.image}
        resizeMode="cover"
      />

      {/**
       * Gradient overlay — sits on top of the image.
       * Goes from transparent (top) to near-black (bottom).
       * This makes the white text below readable on any photo.
       *
       * colors array: index 0 = top of gradient, last index = bottom.
       * start/end control the gradient direction (vertical here).
       */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0.3 }}  // gradient starts 30% from the top
        end={{ x: 0.5, y: 1 }}      // gradient ends at the very bottom
      />

      {/* Text info — positioned absolutely at the bottom of the card */}
      <View style={styles.info}>

        {/* Name + Age on the same row */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.age}>{profile.age}</Text>
        </View>

        {/* Location row with pin emoji */}
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location}>{profile.location}</Text>
        </View>

        {/* Bio — numberOfLines={2} truncates with "..." after 2 lines */}
        <Text style={styles.bio} numberOfLines={2}>
          {profile.bio}
        </Text>

        {/**
         * Interest chips — rendered by mapping over the interests array.
         * .slice(0, 3) ensures we show at most 3 chips so the card
         * doesn't overflow, regardless of how many interests exist.
         *
         * CONCEPT — .map():
         *   Array.map() transforms each item in an array into a
         *   React element. `key` is required to help React track
         *   which item is which when the list updates.
         */}
        <View style={styles.chips}>
          {profile.interests.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── STYLES ─────────────────────────────────────────────────
// StyleSheet.create() is React Native's way of defining styles.
// Similar to CSS but uses camelCase (e.g. borderRadius not border-radius)
// and all units are in dp (density-independent pixels), not px.
const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: Radius.xl,   // Strongly rounded corners
    overflow: 'hidden',         // Clips the image to the rounded corners
    backgroundColor: Colors.greyDark,
    // Shadow — elevation is Android, shadowX is iOS
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Sits behind the gradient and text
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%', // Covers the bottom 70% of the card
  },
  info: {
    position: 'absolute', // Pins this view to the bottom of the card
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    gap: Spacing.xs, // gap is like CSS gap — space between children
  },
  nameRow: {
    flexDirection: 'row',       // Lay children horizontally
    alignItems: 'flex-end',     // Align to bottom so name and age baseline-align
    gap: Spacing.sm,
  },
  name: {
    fontFamily: Fonts.display,
    fontSize: 30,
    color: Colors.white,
  },
  age: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 22,
    color: Colors.greyMid,
    marginBottom: 3, // Nudge up slightly to align with name baseline
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationIcon: {
    fontSize: 12,
  },
  location: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.greyMid,
  },
  bio: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginTop: 2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Wrap to next line if chips overflow
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.15)', // Semi-transparent white
    borderRadius: Radius.full,  // Pill shape
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.white,
  },
});
