# Skylark AR Game - Technical Specification Document

**Version:** 1.0
**Date:** January 25, 2026
**Project:** Phoenix AR / Skylark
**Platform:** Web-based AR (8th Wall + Google Maps 3D)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Game Overview](#game-overview)
3. [Game Objectives](#game-objectives)
4. [Core Mechanics](#core-mechanics)
5. [Collectibles & Items](#collectibles--items)
6. [Progression System](#progression-system)
7. [Locations & Points of Interest](#locations--points-of-interest)
8. [Winning Opportunities & Rewards](#winning-opportunities--rewards)
9. [Player Journey (Start to Finish)](#player-journey-start-to-finish)
10. [Technical Architecture](#technical-architecture)
11. [User Interface & Navigation](#user-interface--navigation)
12. [Data Persistence](#data-persistence)
13. [Future Expansion](#future-expansion)

---

## Executive Summary

**Skylark** is a location-based augmented reality (AR) game that transforms Atlanta into an interactive treasure hunt playground. Players explore real-world locations to collect various digital assets, complete quizzes, unlock collectibles, and compete on leaderboards. The game combines GPS-based navigation, 3D object placement, knowledge challenges, and social features to create an engaging gamified experience.

### Key Features
- Real-time GPS tracking with 3D map visualization
- AR collectibles with varying rarity levels
- Interactive quiz challenges
- Progressive unlock systems
- Daily streak mechanics
- Leaderboard competition
- Homebase locations
- Quest & achievement system

---

## Game Overview

### Setting
- **Primary Location:** Atlanta, Georgia
- **Environment:** Real-world urban exploration
- **Map Technology:** Google Maps 3D with photorealistic tiles
- **AR Technology:** 8th Wall WebAR

### Core Loop
1. **Explore** → Navigate real-world locations using GPS
2. **Discover** → Find collectibles and special items on the map
3. **Collect** → Tap/interact with objects to collect them
4. **Challenge** → Answer quiz questions to unlock rewards
5. **Progress** → Earn points, level up, unlock new content
6. **Compete** → Compare scores on leaderboards

---

## Game Objectives

### Primary Objective
Become the top collector in Atlanta by accumulating the most GSKY tokens and rare collectibles.

### Secondary Objectives
1. **Complete Daily Streaks** - Collect Nova coins daily to maintain streaks
2. **Master Knowledge** - Answer quiz questions correctly
3. **Discover All Homebases** - Visit special landmark locations
4. **Unlock Collectible Chains** - Trigger sequential unlocks
5. **Achieve Quest Goals** - Complete challenges and missions
6. **Climb Leaderboards** - Compete for top rankings

---

## Core Mechanics

### 1. Movement & Exploration

**GPS-Based Navigation**
- Real-time player position tracking
- Accuracy requirement: ~15 meters
- Continuous location updates
- 3D map rendering with:
  - Tilt: 50° (bird's eye view)
  - Range: 500-2000 meters
  - Heading: Dynamic based on player orientation

**Collection Radius**
- **Standard Radius:** 500 feet (152.4 meters)
- **Distance Checking:** Great-circle distance calculation
- **Too Far Mechanic:** Visual feedback when out of range

### 2. Coin Collection System

**Dynamic Coin Spawning**
- Coins spawn randomly around player location
- Multiple coin types with varying values and distances
- 3D models scale based on value

**Coin Types:**

| Type | Points | Scale | Distance from Player |
|------|--------|-------|---------------------|
| Small | 1 | 1.0 | 50-150 ft |
| Medium | 5 | 1.5 | 100-200 ft |
| Large | 10 | 2.0 | 150-300 ft |
| Mega | 50 | 3.0 | 200-500 ft |

**Collection Mechanics:**
1. Player taps 3D coin model
2. Distance validation (≤500 ft)
3. Success: Points added, coin removed, animation plays
4. Failure: "Too far!" message displays

### 3. Mario Brick Quiz Challenge

**Location:** Spawns at player's initial location

**Interaction Flow:**
1. Player taps Mario brick
2. Purple quiz modal appears
3. Random multiple-choice question displays (1 of 10)
4. Player selects answer
5. **Correct Answer:**
   - Green feedback animation
   - Brick disappears
   - Gems appear at same location
   - "Revealing gems..." message
6. **Incorrect Answer:**
   - Red feedback animation
   - Modal closes
   - Brick remains for retry

**Quiz Questions:**
- 10 pre-loaded questions covering:
  - Geography
  - Science
  - History
  - Mathematics
  - General knowledge
- Multiple choice (4 options each)
- One correct answer per question

**Rewards:**
- Unlocks gems at brick location
- Gems worth collection tracking

### 4. Gem Collection

**Appearance:** After correctly answering Mario brick quiz

**Properties:**
- 3D model: `gems.glb`
- Scale: 5
- Location: Same as Mario brick position

**Collection:**
- Tap to collect
- Increments "Gems Collected" counter
- Tracked in player inventory
- Persistent across sessions

### 5. Special Coin System

#### Phoenix Coins
- **Rarity:** Rare
- **Spawning:** Special conditions/locations
- **Tracking:** Collection history with timestamps
- **Display:** Fire emoji (🔥) in profile

#### Nova Coins
- **Rarity:** Semi-rare
- **Unique Mechanic:** Daily streak system
- **Streak Calculation:**
  - Collect on consecutive days
  - Streak breaks if day missed
  - Counter displays current streak
- **Display:** Star emoji (⭐) in profile

### 6. Collectibles System

**Unlock Chain Mechanism:**

**Example Chain:**
```
Person (person0.glb)
  → Collect for 47 points
  → Unlocks Windmill
       → Collect for 100 points
       → Potential to unlock next item
```

**States:**
- **Locked:** Not yet available (gray/hidden)
- **Unlocked:** Available for collection
- **Collected:** Already obtained

**Implementation:**
- Each collectible has `unlocksCollectible` property
- Automatic unlock triggers on collection
- Point values vary by rarity
- Persistent state tracking

### 7. Homebase System

**Current Homebase:**
- **Name:** Atlanta Blockchain Center
- **Location:** 33.8541508, -84.381267
- **Plus Code:** VJ39+MF

**Functionality:**
- Marked with 3D pawn model (scale 4.0)
- Click interaction shows info alert
- Potential quest/reward hub
- Strategic gathering points

---

## Collectibles & Items

### Inventory Categories

| Category | Symbol | Description | Persistence |
|----------|--------|-------------|-------------|
| GSKY Tokens | 🪙 | Primary currency/points | Yes |
| Phoenix Coins | 🔥 | Rare collectible | Yes |
| Nova Streak | ⭐ | Consecutive day counter | Yes |
| Gems Collected | 💎 | Quiz reward items | Yes |

### 3D Models Used

| Model File | Scale | Usage | Interaction |
|------------|-------|-------|-------------|
| `coin.glb` | 1-3 | Standard coins | Tap to collect |
| `mariobrickresize.glb` | 5 | Quiz trigger | Tap for quiz |
| `gems.glb` | 5 | Quiz reward | Tap to collect |
| `person0.glb` | 15 | Collectible | Unlock chain |
| `windmill.glb` | 0.15 | Collectible | Unlocked item |
| `pawn2.glb` | 4 | Homebase marker | Info display |

---

## Progression System

### Experience & Levels

**Current Level Display:** Level 12 (example)
- Level shown in profile
- Experience bar with percentage
- Visual progression indicator

**Leveling Mechanics:**
- Earn XP through collections
- Level up unlocks new features
- Profile badge displays current level

### Point Accumulation

**Point Sources:**
- Standard coins: 1-50 points
- Mario brick: 47 points (removed in quiz update)
- Collectibles: 47-100+ points
- Quest completion: 50-200 points

**Point Display:**
- Real-time counter in profile
- Floating animation on collection
- Persistent total across sessions

### Social Features

**Profile Stats:**
- Username & display name
- Followers count
- Following count
- Level badge

**Leaderboard:**
- Global rankings
- Point-based sorting
- Real-time updates
- Competitive element

---

## Locations & Points of Interest

### Dynamic Spawning

**Coin Spawning Logic:**
```
Around player position:
- Offset: ±0.001 to ±0.003 lat/lng
- Distance: 50-500 feet
- Count: Variable (currently ~10-20)
- Refresh: On location change
```

### Homebase Locations

**Atlanta Blockchain Center:**
- Primary hub location
- Strategic gathering point
- Potential quest giver
- Community focal point

**Expansion Potential:**
- Additional Atlanta landmarks
- Cultural hotspots
- Business partnerships
- Event locations

---

## Winning Opportunities & Rewards

### Competitive Victory Conditions

#### 1. Leaderboard Champion
- **Objective:** Achieve #1 ranking
- **Metric:** Total GSKY tokens
- **Reward:** Bragging rights, potential prizes

#### 2. Streak Master
- **Objective:** Longest Nova coin streak
- **Metric:** Consecutive days collected
- **Reward:** Bonus multipliers, exclusive items

#### 3. Knowledge Expert
- **Objective:** 100% quiz accuracy
- **Metric:** Correct answers / total attempts
- **Reward:** Bonus gems, special badge

#### 4. Complete Collector
- **Objective:** Collect all collectibles
- **Metric:** All items in "collected" state
- **Reward:** Master collector badge

#### 5. Quest Completionist
- **Objective:** Complete all available quests
- **Metric:** Quest completion percentage
- **Reward:** Special unlocks, points

### Quest System

**Quest Types:**

1. **Daily Check-In**
   - Description: Open app daily
   - Reward: 50 points
   - Repeatable: Daily

2. **Collection Challenges**
   - Description: Collect X tokens
   - Example: "Collect 10 GSKY Tokens"
   - Reward: 100 points
   - Progress: Tracked incrementally

3. **Exploration Quests**
   - Description: Visit X homebases
   - Example: "Atlanta Explorer - Visit 3 homebases"
   - Reward: 200 points
   - Progress: Location-based tracking

4. **Community Polls**
   - Description: Participate in governance
   - Reward: 75 points
   - Engagement: Social feature

### Offer System

**Categories:**
- Unused offers
- Used offers
- Expired offers
- All offers

**Redemption:**
- Phoenix coin requirements
- Point thresholds
- Quest completion prerequisites

**Potential Offers:**
- Real-world rewards
- Gift cards
- Exclusive content
- Special abilities
- Cosmetic items

---

## Player Journey (Start to Finish)

### Phase 1: Onboarding (First 10 Minutes)

1. **Welcome Screen**
   - App opens
   - Location permission request
   - Tutorial overlay (if first time)

2. **Map Initialization**
   - GPS lock acquired
   - 3D map loads
   - Player pawn appears
   - Nearby coins spawn

3. **First Collection**
   - Player walks to nearby coin
   - Taps coin (learns interaction)
   - Sees "+X points" animation
   - Profile updates

4. **Discovery**
   - Notices Mario brick
   - Taps brick
   - First quiz appears
   - Learns challenge mechanic

### Phase 2: Core Loop (Daily Play)

1. **Launch & Orient**
   - Open app
   - Check position on map
   - Scan for nearby collectibles

2. **Collection Route**
   - Plan path to items
   - Walk to collection radius
   - Collect accessible items
   - Avoid "too far" items

3. **Daily Challenges**
   - Collect Nova coin (streak)
   - Complete daily quest
   - Check leaderboard position

4. **Quiz Engagement**
   - Attempt Mario brick quiz
   - Answer questions
   - Collect gem rewards
   - Build knowledge score

### Phase 3: Mid-Game (Days 2-14)

1. **Streak Building**
   - Return daily for Nova
   - Maintain consecutive days
   - Watch streak counter grow

2. **Collectible Chains**
   - Unlock first collectible
   - Discover chain mechanic
   - Work toward full collection

3. **Homebase Visits**
   - Travel to Atlanta Blockchain Center
   - Discover other homebases
   - Complete exploration quests

4. **Social Integration**
   - Add friends
   - Compare scores
   - Join chat discussions
   - View notifications

### Phase 4: End-Game (Veteran Play)

1. **Optimization**
   - Efficient collection routes
   - Maximum points per session
   - Strategic quiz attempts
   - Leaderboard climbing

2. **Completion Goals**
   - Collect all items
   - Max out all quests
   - Perfect quiz record
   - Top leaderboard position

3. **Community Leadership**
   - High follower count
   - Offer redemptions
   - Event participation
   - Content creation

---

## Technical Architecture

### Frontend Stack

**Framework:** React + TypeScript + Vite
- Component-based architecture
- Type safety throughout
- Fast build times

**State Management:** Zustand
- Centralized game state
- Persistence middleware
- LocalStorage integration

**Styling:** Tailwind CSS
- Utility-first approach
- Responsive design
- Custom animations

### AR & Mapping Technologies

**Google Maps 3D (`@googlemaps/maps3d`)**
- Photorealistic 3D tiles
- Real-world terrain
- Building rendering
- Custom 3D model placement

**8th Wall WebAR**
- Browser-based AR
- No app store required
- Camera access
- Device orientation tracking

### Geolocation System

**Browser Geolocation API**
- `navigator.geolocation.watchPosition()`
- High accuracy mode enabled
- Continuous position updates
- Error handling

**Distance Calculations**
- Haversine formula
- Great-circle distance
- Meter to feet conversion
- Radius validation

### Data Flow

```
User Position (GPS)
  ↓
Geolocation Hook
  ↓
Game Store (Zustand)
  ↓
Map Component
  ↓
3D Object Rendering
  ↓
User Interaction
  ↓
State Update
  ↓
LocalStorage Persistence
```

### File Structure

```
src/
├── components/
│   ├── map/
│   │   └── MapView.tsx          # Main 3D map component
│   ├── navigation/
│   │   ├── TopBar.tsx           # Header with profile/notifications
│   │   └── ExpandableMenu.tsx   # Bottom navigation
│   ├── profile/
│   │   └── ProfilePage.tsx      # User profile & inventory
│   ├── quiz/
│   │   └── QuizModal.tsx        # Quiz interface
│   ├── leaderboard/
│   │   └── Leaderboard.tsx      # Rankings display
│   ├── offers/
│   │   └── PhoenixOffersCards.tsx # Reward redemption
│   └── notifications/
│       └── NotificationPanel.tsx # Alert system
├── store/
│   └── gameStore.ts             # Zustand state management
├── hooks/
│   └── useGeolocation.ts        # GPS tracking hook
├── data/
│   ├── collectibles.ts          # Collectible definitions
│   └── homebases.ts             # Homebase locations
└── types/
    └── index.ts                 # TypeScript definitions
```

---

## User Interface & Navigation

### Screen Layout

```
┌─────────────────────────────────┐
│  [Profile] SKYLARK [🔔]         │ ← Top Bar
├─────────────────────────────────┤
│                                 │
│                                 │
│         3D MAP VIEW             │
│     (Google Maps 3D +           │
│      AR Objects)                │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│  [📍] [🔥] [🏆] [👥] [💬]      │ ← Expandable Menu
└─────────────────────────────────┘
```

### Navigation Menu

**Expandable Menu Bar (Bottom)**
- **Center Button:** Trophy (menu toggle)
- **Left Side:**
  - 📍 Pin: Recenter on player
  - 🔥 Phoenix: Offers page
- **Right Side:**
  - 🏆 Trophy: Leaderboard
  - 👥 Friends: Social features
  - 💬 Chat: Communication

**Top Bar**
- Left: Profile button → Opens ProfilePage
- Center: "SKYLARK" branding
- Right: Notifications button → NotificationPanel

### Modal Overlays

1. **Profile Page**
   - User stats & avatar
   - Inventory display (GSKY, Phoenix, Nova, Gems)
   - Level & XP bar
   - Quest board tab
   - Offers tab
   - Settings button

2. **Quiz Modal**
   - Purple themed
   - Question text (large)
   - 4 answer buttons
   - Feedback display (✅/❌)
   - Close/Cancel button

3. **Leaderboard**
   - Ranked player list
   - Score display
   - Current player highlight
   - Real-time updates

4. **Offers**
   - Card-based layout
   - Category filters
   - Redemption interface
   - Requirement displays

### Animations

**Collection Animation**
```css
@keyframes collectCoin {
  0%   { scale: 0.5, opacity: 1 }
  50%  { scale: 1.5, translate-y: -100px }
  100% { scale: 2.0, translate-y: -200px, opacity: 0 }
}
```

**Visual Feedback:**
- "+X points" floating text
- Color-coded success (yellow) / failure (red)
- 1-second duration
- Center screen position

---

## Data Persistence

### LocalStorage Schema

**Storage Key:** `skylark-game-storage`

**Persisted Data:**
```typescript
{
  userCoins: number,              // Total GSKY tokens
  collectedCoinIds: string[],     // IDs of collected coins
  phoenixCoins: number,           // Rare coin count
  novaCoins: number,              // Semi-rare coin count
  novaStreakDays: number,         // Consecutive days
  novaCollectionHistory: Date[],  // Collection timestamps
  phoenixCollectionHistory: Date[], // Collection timestamps
  collectibles: Collectible[],    // All collectible states
  gemsCollected: number           // Quiz reward gems
}
```

### State Restoration

**On App Launch:**
1. Read from LocalStorage
2. Hydrate Zustand store
3. Restore UI state
4. Resume from last session

**Benefits:**
- Offline progress retention
- No server dependency
- Instant state recovery
- Cross-session continuity

---

## Future Expansion

### Planned Features

#### 1. Multiplayer Interactions
- Real-time player positions
- Trading system
- Cooperative challenges
- PvP competitions

#### 2. Expanded Map Coverage
- Additional cities
- Regional leaderboards
- Location-specific items
- Tourism integration

#### 3. Advanced AR Features
- Image tracking
- Surface detection
- Occlusion rendering
- Multi-marker experiences

#### 4. Monetization
- Premium coins/gems
- Exclusive collectibles
- Ad-free mode
- Subscription tiers

#### 5. Web3 Integration
- NFT collectibles
- Blockchain verification
- Token economy
- Smart contract rewards

#### 6. Event System
- Limited-time spawns
- Seasonal content
- Community events
- Partnership activations

#### 7. Enhanced Social
- Guilds/teams
- Global chat channels
- Friend challenges
- Social feed

#### 8. Gamification Depth
- Skill trees
- Character customization
- Pet/companion system
- Crafting mechanics

---

## Appendix: Key Metrics & KPIs

### Player Engagement
- Daily Active Users (DAU)
- Session duration
- Collections per session
- Quiz completion rate

### Progression Metrics
- Average level by DAU
- Streak retention (7-day, 30-day)
- Quest completion rate
- Collectible unlock percentage

### Monetization (Future)
- Conversion rate
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)
- Offer redemption rate

### Technical Performance
- GPS accuracy average
- Map load time
- 3D model render time
- Crash rate

---

## Conclusion

Skylark combines location-based gameplay, AR technology, knowledge challenges, and social competition to create a compelling urban exploration experience. The game's layered progression systems—from simple coin collection to complex unlock chains—provide both immediate gratification and long-term engagement hooks.

**Core Strengths:**
- Low barrier to entry (web-based, no app install)
- Real-world exploration incentive
- Multiple progression paths
- Social & competitive elements
- Educational component (quizzes)

**Winning Formula:**
```
Physical Activity + Knowledge + Collection + Competition = Sustained Engagement
```

Players who master the location strategy, quiz mechanics, and daily habits will dominate leaderboards and achieve complete collection status—the ultimate victory condition in Skylark.

---

**Document Version:** 1.0
**Last Updated:** January 25, 2026
**Status:** Living Document - Subject to iteration
