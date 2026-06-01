/**
 * theme/index.js
 * ─────────────────────────────────────────────────────────
 * This is the single source of truth for ALL design decisions
 * in the app. Instead of hardcoding colours, sizes, or font
 * names directly inside components, we import them from here.
 *
 * WHY THIS MATTERS:
 *   If the client says "change the red to a different shade",
 *   you update ONE line here and every screen updates instantly.
 *   This is called a "design token" pattern — common in
 *   professional apps (Airbnb, Uber, etc.).
 */

// ─── COLOURS ────────────────────────────────────────────────
// The assessment specifies: White, Grey, Black, Red (accent).
// We define multiple shades of each so we can create depth
// without introducing entirely new colours.
export const Colors = {
  white: '#FFFFFF',         // Pure white — used for backgrounds and text on dark
  black: '#111111',         // Soft black (not pure #000) — easier on the eyes
  red: '#E8192C',           // Primary accent — buttons, likes, branding
  redLight: '#FF4D5E',      // Lighter red — gradient starts, hover states
  redDark: '#B5001F',       // Darker red — gradient ends, shadows
  grey: '#8A8A8A',          // Mid grey — secondary text, subtitles
  greyLight: '#F4F4F4',     // Very light grey — card backgrounds, input fields
  greyMid: '#D0D0D0',       // Mid-light grey — borders, dividers
  greyDark: '#3A3A3A',      // Dark grey — body text on white backgrounds
  overlay: 'rgba(0,0,0,0.35)', // Semi-transparent black — overlays on images
};

// ─── FONTS ──────────────────────────────────────────────────
// We use two font families loaded via expo-font (see App.js):
//   • PlayfairDisplay — a serif display font, elegant and editorial.
//     Used for headings, names, and the app title.
//   • Nunito — a rounded sans-serif, friendly and readable.
//     Used for body copy, labels, and buttons.
//
// The string values here MUST exactly match the font keys
// registered in App.js's useFonts() call.
export const Fonts = {
  display: 'PlayfairDisplay_700Bold',          // Big headings, app name
  displayItalic: 'PlayfairDisplay_700Bold_Italic', // Optional italic variant
  body: 'Nunito_400Regular',                   // Normal body text
  bodySemiBold: 'Nunito_600SemiBold',          // Slightly emphasised text
  bodyBold: 'Nunito_700Bold',                  // Buttons, labels, bold text
};

// ─── SPACING ────────────────────────────────────────────────
// A consistent spacing scale (in pixels/dp) keeps layouts
// visually balanced. Instead of random numbers like padding: 13,
// we always pick from this scale. This is a standard practice
// borrowed from design systems like Material Design and Tailwind.
export const Spacing = {
  xs: 4,   // Tiny gaps — between chips, icon + text pairs
  sm: 8,   // Small gaps — between related elements
  md: 16,  // Medium — standard padding inside cards/containers
  lg: 24,  // Large — section padding, screen edges
  xl: 32,  // Extra large — major section breaks
  xxl: 48, // Hero spacing — top of welcome screen, etc.
};

// ─── BORDER RADIUS ──────────────────────────────────────────
// Controls how "rounded" corners are. Using a scale (instead of
// random values) keeps the UI feel consistent everywhere.
export const Radius = {
  sm: 8,    // Subtle rounding — small chips, inputs
  md: 16,   // Cards, panels
  lg: 24,   // Bottom sheets, large cards
  xl: 32,   // Profile swipe cards
  full: 999, // Perfect circle / pill shape — buttons, avatars
};
