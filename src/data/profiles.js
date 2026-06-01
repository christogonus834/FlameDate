/**
 * src/data/profiles.js
 * ─────────────────────────────────────────────────────────
 * This file is the app's mock database.
 *
 * In a real production dating app, this data would come from
 * a backend API (e.g. a Node.js + PostgreSQL server). For this
 * assessment, we use local static data to keep things simple
 * and avoid needing internet or a server to run the app.
 *
 * DATA SHAPE — each profile object has:
 *   id        → unique identifier (used as React list key)
 *   name      → display name on profile cards
 *   age       → shown next to name on cards
 *   bio       → short personal description
 *   interests → array of interest tags shown as chips
 *   location  → city shown on card and detail screen
 *   image     → URL to a placeholder profile photo
 *               (randomuser.me is a free public API for this)
 *   match     → boolean, currently unused but ready for
 *               future match state tracking
 *
 * WHY AN ARRAY?
 *   The swipe library (react-native-deck-swiper) expects an
 *   array of data. It iterates through it card by card.
 */
export const profiles = [
  {
    id: '1',
    name: 'Amara',
    age: 26,
    bio: 'Lover of sunsets, jollof rice, and good conversations.',
    interests: ['Travel', 'Cooking', 'Music'],
    location: 'Lagos, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    match: false,
  },
  {
    id: '2',
    name: 'Zara',
    age: 24,
    bio: 'Bookworm by day, dancer by night. Looking for someone real.',
    interests: ['Books', 'Dance', 'Photography'],
    location: 'Abuja, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    match: false,
  },
  {
    id: '3',
    name: 'Fatima',
    age: 27,
    bio: 'Architect. Coffee addict. Will fight you over pineapple on pizza.',
    interests: ['Design', 'Coffee', 'Hiking'],
    location: 'Kano, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    match: false,
  },
  {
    id: '4',
    name: 'Chisom',
    age: 25,
    bio: 'Nurse, foodie, and occasional poet. Swipe right if you love life.',
    interests: ['Health', 'Food', 'Poetry'],
    location: 'Enugu, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/90.jpg',
    match: false,
  },
  {
    id: '5',
    name: 'Ngozi',
    age: 28,
    bio: 'Tech founder by day. Afrobeats fan always. Passport full of stamps.',
    interests: ['Tech', 'Music', 'Travel'],
    location: 'Port Harcourt, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    match: false,
  },
  {
    id: '6',
    name: 'Temi',
    age: 23,
    bio: 'Fashion designer who paints on weekends. Searching for depth.',
    interests: ['Fashion', 'Art', 'Film'],
    location: 'Ibadan, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/76.jpg',
    match: false,
  },
  {
    id: '7',
    name: 'Ada',
    age: 29,
    bio: 'Lawyer who loves true crime podcasts and long drives at night.',
    interests: ['Law', 'Podcasts', 'Driving'],
    location: 'Lagos, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/57.jpg',
    match: false,
  },
  {
    id: '8',
    name: 'Kemi',
    age: 26,
    bio: 'Plant mom. Yoga lover. Looking for someone who remembers to water theirs.',
    interests: ['Yoga', 'Plants', 'Meditation'],
    location: 'Abuja, Nigeria',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    match: false,
  },
];
