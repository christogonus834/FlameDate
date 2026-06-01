/**
 * src/navigation/AppNavigator.js
 * ─────────────────────────────────────────────────────────
 * This file is responsible for ALL navigation in the app —
 * i.e. how the user moves between screens.
 *
 * We use React Navigation's Stack Navigator, which works like
 * a stack of cards:
 *   • navigate('Swipe')  → pushes Swipe on top of the stack
 *   • navigation.goBack() → pops the top card off, revealing the one below
 *
 * STACK ORDER:
 *   Welcome  ──►  Swipe  ──►  ProfileDetail
 *            ◄──         ◄──
 *          (goBack)    (goBack)
 */

import React from 'react';

// NavigationContainer is the ROOT wrapper — it holds all navigation state.
// There must be exactly ONE of these in the entire app (placed in App.js
// via AppNavigator). It tracks which screen is active and manages history.
import { NavigationContainer } from '@react-navigation/native';

// createStackNavigator gives us a Navigator + Screen pair.
// Stack = screens stack on top of each other like browser history.
import { createStackNavigator } from '@react-navigation/stack';

// Import each screen component. The navigator renders whichever
// one is currently active.
import WelcomeScreen from '../screens/WelcomeScreen';
import SwipeScreen from '../screens/SwipeScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';

// Create the stack navigator instance.
// Stack.Navigator and Stack.Screen come from this.
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    /**
     * NavigationContainer must wrap everything.
     * It provides navigation context to all child components,
     * allowing them to use the `navigation` prop.
     */
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"  // The first screen shown when app opens
        screenOptions={{
          headerShown: false,   // We build our own custom headers in each screen
          gestureEnabled: false, // Disable swipe-back gesture (conflicts with card swiper)
        }}
      >
        {/**
         * Each Stack.Screen registers a screen in the navigator.
         *   name    → the string used in navigation.navigate('...')
         *   component → the React component to render for that screen
         *
         * Passing data between screens uses route.params.
         * Example: navigation.navigate('ProfileDetail', { profile: data })
         * Then in ProfileDetailScreen: const { profile } = route.params
         */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Swipe" component={SwipeScreen} />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
