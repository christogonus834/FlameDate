/**
 * src/screens/SwipeScreen.js
 * ─────────────────────────────────────────────────────────
 * SCREEN 2 — Core swipe screen. Built WITHOUT react-native-deck-swiper
 * because it is incompatible with Hermes (Expo 54).
 *
 * Instead we use:
 *   • react-native-reanimated  — for smooth 60fps animations
 *   • PanResponder (built into React Native) — for drag gesture detection
 *
 * HOW THE SWIPE WORKS:
 *   1. User touches and drags the card (PanResponder tracks dx, dy)
 *   2. The card follows the finger (translateX animated value)
 *   3. When released:
 *      - If dragged > 120px right → swipe right (like)
 *      - If dragged > 120px left  → swipe left (nope)
 *      - Otherwise → spring back to centre
 *   4. On swipe right → 50% chance of match → show MatchModal
 *   5. Card animates off screen, next profile becomes the top card
 *
 * CONCEPT — PanResponder:
 *   React Native's built-in gesture system. It tracks touch events
 *   and gives us dx (horizontal distance) and dy (vertical distance)
 *   as the user drags. We use dx to move the card left or right.
 *
 * CONCEPT — Animated.ValueXY:
 *   Like Animated.Value but tracks BOTH x and y positions.
 *   position.x drives the card's horizontal movement.
 *   position.y drives the card's slight vertical tilt.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import ProfileCard, { CARD_WIDTH, CARD_HEIGHT } from '../components/ProfileCard';
import SwipeButtons from '../components/SwipeButtons';
import MatchModal from '../components/MatchModal';
import { profiles as initialProfiles } from '../data/profiles';

const { width, height } = Dimensions.get('window');

// How far the user must drag before it counts as a swipe
const SWIPE_THRESHOLD = 120;
// How fast the card flies off screen after a swipe
const SWIPE_OUT_DURATION = 250;

export default function SwipeScreen({ navigation }) {
  // currentIndex tracks which profile is on top of the stack
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [noMoreCards, setNoMoreCards] = useState(false);

  /**
   * Animated.ValueXY tracks the card's x and y position.
   * Starts at {x: 0, y: 0} = centre of screen.
   * As user drags, x changes. We reset it after each swipe.
   */
  const position = useRef(new Animated.ValueXY()).current;

  /**
   * forceSwipeRight/Left — programmatic swipe from buttons.
   * Animates card off screen then calls onSwipeComplete.
   */
  const forceSwipe = useCallback((direction) => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => onSwipeComplete(direction));
  }, [currentIndex]);

  /**
   * onSwipeComplete — called after card finishes animating off screen.
   * Resets position, checks for match, advances to next card.
   */
  const onSwipeComplete = useCallback((direction) => {
    // Reset card position to centre (for the next card)
    position.setValue({ x: 0, y: 0 });

    if (direction === 'right') {
      // 50% random match chance on right swipe
      const isMatch = Math.random() > 0.5;
      if (isMatch) {
        setMatchedProfile(initialProfiles[currentIndex]);
        setShowMatch(true);
      }
    }

    // Move to next card
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= initialProfiles.length) {
        setNoMoreCards(true);
      }
      return next;
    });
  }, [currentIndex, position]);

  /**
   * PanResponder — handles all touch/drag events on the card.
   *
   * onStartShouldSetPanResponder: return true to claim this touch
   * onPanResponderMove: called every frame while dragging
   *   → updates position.x and position.y so card follows finger
   * onPanResponderRelease: called when user lifts finger
   *   → decide: swipe off screen or spring back to centre
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // Move card to follow finger position
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Dragged far enough RIGHT → like
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Dragged far enough LEFT → nope
          forceSwipe('left');
        } else {
          // Not far enough → spring back to centre
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 5,
          }).start();
        }
      },
    })
  ).current;

  /**
   * getCardStyle — computes the animated style for the TOP card.
   *
   * rotate: as card moves right, it tilts clockwise.
   *   inputRange:  [-width, 0, width]  (left edge, centre, right edge)
   *   outputRange: ['-30deg', '0deg', '30deg']
   *
   * interpolate() maps one range of values to another — here we
   * map horizontal position to rotation angle.
   */
  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-width, 0, width],
      outputRange: ['-30deg', '0deg', '30deg'],
      extrapolate: 'clamp', // Don't go beyond the output range
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate },
      ],
    };
  };

  /**
   * getLikeOpacity / getNopeOpacity — fades in the LIKE/NOPE label
   * as the card is dragged in that direction.
   */
  const getLikeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const getNopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  /**
   * renderCards — renders the card stack.
   * Top card (currentIndex) gets the pan gesture and animation.
   * Cards behind it (currentIndex+1, +2) are rendered statically
   * slightly smaller and offset to create a "stack" depth effect.
   */
  const renderCards = () => {
    if (noMoreCards) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔥</Text>
          <Text style={styles.emptyTitle}>You've seen everyone!</Text>
          <Text style={styles.emptyText}>Come back later for more matches.</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              position.setValue({ x: 0, y: 0 });
              setCurrentIndex(0);
              setNoMoreCards(false);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.resetBtnText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Render up to 3 cards (top + 2 behind)
    return initialProfiles
      .slice(currentIndex, currentIndex + 3)
      .map((profile, i) => {
        // Top card — draggable and animated
        if (i === 0) {
          return (
            <Animated.View
              key={profile.id}
              style={[styles.cardWrapper, getCardStyle(), { zIndex: 10 }]}
              {...panResponder.panHandlers} // Attach gesture handlers
            >
              {/* LIKE label — fades in when dragging right */}
              <Animated.View style={[styles.overlayLabel, styles.likeLabel, { opacity: getLikeOpacity }]}>
                <Text style={styles.likeLabelText}>LIKE</Text>
              </Animated.View>

              {/* NOPE label — fades in when dragging left */}
              <Animated.View style={[styles.overlayLabel, styles.nopeLabel, { opacity: getNopeOpacity }]}>
                <Text style={styles.nopeLabelText}>NOPE</Text>
              </Animated.View>

              <ProfileCard profile={profile} />
            </Animated.View>
          );
        }

        // Cards behind — static, slightly scaled down and offset
        // i=1 → second card, i=2 → third card
        const scale = 1 - i * 0.04;      // Each card behind is 4% smaller
        const translateY = i * 14;        // Each card behind is 14px lower

        return (
          <Animated.View
            key={profile.id}
            style={[
              styles.cardWrapper,
              {
                zIndex: 10 - i,
                transform: [{ scale }, { translateY }],
              },
            ]}
          >
            <ProfileCard profile={profile} />
          </Animated.View>
        );
      })
      .reverse(); // Reverse so first card renders ON TOP
  };

  const handleCloseMatch = () => {
    setShowMatch(false);
    setMatchedProfile(null);
  };

  const handleViewProfile = () => {
    setShowMatch(false);
    navigation.navigate('ProfileDetail', {
      profile: matchedProfile,
      isMatch: true,
    });
    setMatchedProfile(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <Text style={styles.flame}>🔥</Text>
            <Text style={styles.appName}>FlameDate</Text>
          </View>

          <View style={styles.placeholder} />
        </View>

        <Text style={styles.subtitle}>Discover People</Text>

        {/* Card stack area */}
        <View style={styles.cardContainer}>
          {renderCards()}
        </View>

        {/* Action buttons — hidden when no cards left */}
        {!noMoreCards && (
          <SwipeButtons
            onNope={() => forceSwipe('left')}
            onLike={() => forceSwipe('right')}
          />
        )}
      </SafeAreaView>

      <MatchModal
        visible={showMatch}
        profile={matchedProfile}
        onClose={handleCloseMatch}
        onViewProfile={handleViewProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: '600',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flame: { fontSize: 20 },
  appName: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.black,
  },
  placeholder: { width: 40 },
  subtitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.grey,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  // The area that holds all stacked cards
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Each card is absolutely positioned so they stack on top of each other
  cardWrapper: {
    position: 'absolute',
  },
  // LIKE / NOPE overlay labels on the card
  overlayLabel: {
    position: 'absolute',
    zIndex: 99,
    top: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 3,
  },
  likeLabel: {
    left: 20,
    borderColor: Colors.red,
    transform: [{ rotate: '-15deg' }],
  },
  likeLabelText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.red,
  },
  nopeLabel: {
    right: 20,
    borderColor: '#FF6B6B',
    transform: [{ rotate: '15deg' }],
  },
  nopeLabelText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF6B6B',
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 26,
    color: Colors.black,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: 22,
  },
  resetBtn: {
    backgroundColor: Colors.red,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  resetBtnText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.white,
  },
});
