# FlameDate

A minimalistic dating mobile application built with **React Native Expo** as part of a Technical Assessment.

---

## Project Overview

FlameDate is a clean, modern dating app prototype inspired by Tinder's swipe interaction. It features smooth gesture animations, a bold minimalistic design (white, grey, black, red), and three polished screens delivering a complete core user experience.

---

## Features Implemented

- Welcome Screen — Branded entry point with animated logo, headline, and CTA button
- Swipe Match Screen — Tinder-style swipe left/right with gesture overlays (LIKE / NOPE labels), stacked card UI, and 50% random match logic
- Match Modal — Animated popup celebrating a match with options to view profile or keep swiping
- Profile Detail Screen — Full profile view with hero image, bio, interests, location, compatibility score, match banner, wave button, and action buttons (Like + Message)
- Empty State — Friendly UI when all cards are swiped with a "Start Over" option

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React Native Expo (~54) | Core framework |
| React Navigation (Stack) | Screen navigation |
| expo-linear-gradient | Gradient backgrounds and buttons |
| expo-font + Google Fonts | Playfair Display + Nunito typography |
| react-native-reanimated | Smooth animations |
| react-native-gesture-handler | Gesture support |

---

## Folder Structure

```
FlameDate/
├── index.js                      Root entry point (registers the app)
├── App.js                        Root component (navigation entry)
├── app.json                      Expo config
├── babel.config.js               Babel transpiler config
├── eas.json                      EAS build config (APK generation)
├── package.json                  Dependencies and scripts
├── .gitignore                    Files excluded from git
├── README.md                     Project documentation
└── src/
    ├── screens/
    │   ├── WelcomeScreen.js      Screen 1 — branded entry point
    │   ├── SwipeScreen.js        Screen 2 — Tinder-style swipe
    │   └── ProfileDetailScreen.js Screen 3 — full profile view
    ├── components/
    │   ├── ProfileCard.js        Reusable swipe card UI
    │   ├── SwipeButtons.js       Like / Nope buttons
    │   └── MatchModal.js         Animated match celebration popup
    ├── navigation/
    │   └── AppNavigator.js       Stack navigation (Welcome → Swipe → Profile)
    ├── data/
    │   └── profiles.js           Mock profile data (8 profiles)
    └── theme/
        └── index.js              Design tokens (colors, fonts, spacing, radius)
```

---

## Setup and Installation

### Prerequisites
- Node.js 18+
- Expo Go app on your phone (Android)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/christogonus834/FlameDate.git

# 2. Enter the project
cd FlameDate

# 3. Install dependencies
npm install

# 4. Start the dev server
npx expo start

# 5. Scan the QR code with Expo Go on your phone
```

---

## APK Download

**EAS Build:** https://expo.dev/accounts/nnadoziedrix/projects/flamedate/builds/d7c1f05a-f4d8-4791-8e76-1ab8068cd3da

**Google Drive:** Coming soon

### Install Instructions
1. Download the APK from the link above
2. On your Android device go to **Settings → Security → Unknown Sources → Enable**
3. Open the downloaded `.apk` file
4. Tap **Install**
5. Open FlameDate

---

## Assumptions Made

- Profile data is mocked locally (no backend or API)
- Match logic is simulated at 50% random probability on swipe right
- Images are loaded from `randomuser.me` (public placeholder API)
- The app is Android-first (APK submission); iOS not included in this build

---

## Known Limitations

- No persistent storage — matches reset on app restart
- No real messaging functionality — message button shows an alert
- Images depend on internet connection (randomuser.me)

---

## Security Considerations

These are the security measures that would be implemented before taking this app to production:

**Input Sanitization**
All user-generated text (name, bio, messages) would be stripped of HTML tags and script injections on both the client and server side. Character limits and whitespace trimming are enforced on every text input.

**Rate Limiting**
API endpoints would be protected with rate limiting to prevent abuse — for example a maximum of 5 login attempts per 15 minutes and a cap on swipe actions per hour. This lives on the backend using a library like `express-rate-limit`.

**Secure Token Storage**
Authentication tokens would be stored using `expo-secure-store` instead of AsyncStorage. AsyncStorage is unencrypted and readable on a rooted device. `expo-secure-store` uses the device keychain (iOS) and Keystore (Android) which are hardware-backed.

**Image Upload Validation**
Profile image uploads would be validated on the server by reading the actual file buffer to confirm the file type — not just trusting the file extension. File size limits would be enforced and images would be served through a CDN such as Cloudinary or AWS S3.

**Profile Data Protection**
API responses would never expose sensitive fields such as password hashes, email addresses, or device identifiers. A response serializer would whitelist only the fields the client is permitted to see.

**Location Privacy**
Exact GPS coordinates would never be stored or exposed. Only approximate location (city level or a fuzzy radius) would be returned to prevent users from being physically tracked.

**HTTPS Enforcement**
All API communication would be over HTTPS only. Android's `network_security_config.xml` would block all cleartext HTTP traffic in production builds.

**APK Obfuscation**
ProGuard or R8 minification would be enabled in the EAS build configuration to obfuscate the compiled code, making it significantly harder to reverse engineer the APK and extract any logic or keys.

**Environment Variables**
API keys, base URLs, and secrets would be stored in `.env` files using `expo-constants` and excluded from the repository via `.gitignore`. No secrets would ever be committed to GitHub.

---

## Repository

GitHub: https://github.com/christogonus834/FlameDate