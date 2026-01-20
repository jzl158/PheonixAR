// Location type definitions based on ActivationTypes.md and GameArtifacts.md

export type LocationType =
  | 'gsky-token'
  | 'phoenix-coin'
  | 'nova-coin'
  | 'gift-card'
  | 'ar-experience'
  | 'homebase'
  | 'terminus-dao'
  | 'grillz'
  | 'lpw-chicken'
  | 'offer'
  | 'mint-marquee';

export type ActivationType = 'instant-claim' | 'skylark' | 'spark' | 'claim' | 'assorted';

export type RewardType = 'fungible' | 'non-fungible' | 'limited-quantity' | 'badge';

export interface BaseLocation {
  id: string;
  type: LocationType;
  position: {
    lat: number;
    lng: number;
  };
  activationType: ActivationType;
  rewardType: RewardType;
  proximityRequired: number; // in feet
}

// GSKY Token - comes in denominations, appears frequently
export interface GSkyToken extends BaseLocation {
  type: 'gsky-token';
  value: 1 | 3 | 5 | 7 | 10 | 15 | 20 | 25;
  activationType: 'instant-claim';
  proximityRequired: 500;
}

// Phoenix Coins - rare coins that appear seldomly
export interface PhoenixCoin extends BaseLocation {
  type: 'phoenix-coin';
  activationType: 'instant-claim';
  proximityRequired: 50;
  rarity: 'rare';
}

// Nova Coins - semi-rare, worth 100 points, daily streak mechanic
export interface NovaCoin extends BaseLocation {
  type: 'nova-coin';
  value: 100;
  activationType: 'instant-claim';
  proximityRequired: 50;
  rarity: 'semi-rare';
  dailyStreak?: boolean;
}

// Gift Cards - location-based activations
export interface GiftCard extends BaseLocation {
  type: 'gift-card';
  title: string;
  description: string;
  merchantName: string;
  merchantImage?: string;
  value: number; // dollar amount
  activationType: 'skylark';
  proximityRequired: 50;
  code?: string;
}

// AR Experiences - location-based AR activations
export interface ARExperience extends BaseLocation {
  type: 'ar-experience';
  title: string;
  description: string;
  activationType: 'skylark' | 'spark' | 'claim';
  proximityRequired: 50;
  experienceUrl?: string;
}

// Homebases - special locations with badges
export interface Homebase extends BaseLocation {
  type: 'homebase';
  name: string;
  address: string;
  description: string;
  activationType: 'assorted';
  proximityRequired: 50;
  badges?: string[];
  image?: string;
}

// Terminus DAO Stops
export interface TerminusDAO extends BaseLocation {
  type: 'terminus-dao';
  name: string;
  description: string;
  activationType: 'assorted';
  proximityRequired: 50;
  badges?: string[];
}

// Atlanta Gems - Grillz
export interface Grillz extends BaseLocation {
  type: 'grillz';
  name: string;
  description: string;
  activationType: 'assorted';
  proximityRequired: 50;
}

// Atlanta Gems - Lemon Pepper Wet Chicken
export interface LPWChicken extends BaseLocation {
  type: 'lpw-chicken';
  name: string;
  description: string;
  activationType: 'assorted';
  proximityRequired: 50;
}

// Offers - location-based offers
export interface Offer extends BaseLocation {
  type: 'offer';
  title: string;
  description: string;
  merchantName: string;
  merchantImage?: string;
  value: number;
  requiredLevel: number;
  activationType: 'assorted';
  proximityRequired: 50;
  expiryDate?: Date;
  code?: string;
  status?: 'unused' | 'used' | 'expired';
}

// Mint & Marquee Items - limited quantity 3D printed collectibles
export interface MintMarquee extends BaseLocation {
  type: 'mint-marquee';
  title: string;
  description: string;
  image?: string;
  activationType: 'assorted';
  proximityRequired: 50;
  quantityAvailable: number;
  quantityTotal: number;
}

// Union type for all location types
export type GameLocation =
  | GSkyToken
  | PhoenixCoin
  | NovaCoin
  | GiftCard
  | ARExperience
  | Homebase
  | TerminusDAO
  | Grillz
  | LPWChicken
  | Offer
  | MintMarquee;

// Player-related types
export interface PlayerStats {
  level: number;
  gSkyBalance: number;
  phoenixCoins: number;
  novaCoins: number;
  novaStreak: number;
  experience: number;
  badges: string[];
  followers: number;
  following: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'nearby-token' | 'nearby-location' | 'offer-expiring' | 'new-offer' | 'check-in-reminder' | 'friend-interaction';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Quest types for the Quest Board
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'poll' | 'challenge' | 'daily-check-in';
  pointsReward: number;
  progress?: number;
  total?: number;
  completed: boolean;
}
