 FlameDate

A minimalistic dating mobile application built with **React Native Expo** as part of a  Technical Assessment.



#My Project Overview

FlameDate is a clean, modern dating app prototype inspired by Tinder's swipe interaction. It features smooth gesture animations, a bold minimalistic design (white, grey, black, red), and three polished screens delivering a complete core user experience.



# Features that was included

 -Welcome Screen — Branded entry point with animated logo, headline, and CTA button
- Swipe Match Screen — Tinder-style swipe left/right with gesture overlays (LIKE / NOPE labels), stacked card UI, and 50% random match logic
- Match Modal — Animated popup celebrating a match with options to view profile or keep swiping
- Profile Detail Screen — Full profile view with hero image, bio, interests, location, match banner, and action buttons (Like + Message)
- Empty State — Friendly UI when all cards are swiped with a "Start Over" option



#Tech Stack

| Tools and their  Purposes |

| React Native Expo (~54)  for Core framework and compatibility  
| React Navigation (Stack)  for Screen navigation 
| react-native-deck-swiper for Tinder-style swipe cards 
| expo-linear-gradient  for Gradient backgrounds and buttons 
| expo-font + Google Fonts  for Playfair Display + Nunito typography 
| react-native-reanimated  for Smooth animations 
| react-native-gesture-handler  Gesture support 



FlameDate/
├── index.js                Root entry point (registers the app)
├── App.js                  Root component (font loading + navigation)
├── app.json                Expo config
├── babel.config.js          Babel transpiler config
├── eas.json                 EAS build config (APK generation)
├── package.json             Dependencies and scripts
├── .gitignore               Files excluded from git
├── README.md                Project documentation
└── src/
    ├── screens/
    │   ├── WelcomeScreen.js      Screen 1 — branded entry point
    │   ├── SwipeScreen.js         Screen 2 — Tinder-style swipe
    │   └── ProfileDetailScreen.js  Screen 3 — full profile view
    ├── components/
    │   ├── ProfileCard.js         Reusable swipe card UI
    │   ├── SwipeButtons.js        Like / Nope / Star buttons
    │   └── MatchModal.js          Animated match celebration popup
    ├── navigation/
    │   └── AppNavigator.js      Stack navigation (Welcome → Swipe → Profile)
    ├── data/
    │   └── profiles.js           Mock profile data (8  profiles)
    └── theme/
        └── index.js              Design tokens (colors, fonts, spacing, radius)



# How to Setup & Installation

#Prerequisites
- Node.js 18+
- Expo Go app on your phone (iOS or Android)

# Steps

bash
# 1. Clone the repository
git clone https://github.com/christogonus834/FlameDate.git

# 2. Enter the project
cd FlameDate

# 3. Install dependencies
npm install

# 4. Start the dev server
npx expo start

# 5. Scan the QR code with Expo Go on your phone


# How to Download the APK

Download Link: [Google Drive APK Link — coming soon]

### Install Instructions
1. Download the APK from the link above
2. On your Android device go to **Settings → Security → Unknown Sources → Enable**
3. Open the downloaded `.apk` file
4. Tap **Install**
5. Open FlameDate


# Assumptions Made

- Profile data is mocked locally (no backend/API)
- Match logic is simulated at 50% random probability on swipe right
- Images are loaded from `randomuser.me` (public placeholder API)
- The app is Android-first (APK submission); iOS not included in this build


# Known Limitations

- No persistent storage (matches reset on app restart)
- No real messaging functionality (message button shows an alert)
- Images depend on internet connection (randomuser.me)


# Repository

GitHub:https://github.com/christogonus834/FlameDate


