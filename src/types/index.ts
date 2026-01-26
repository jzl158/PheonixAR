// User & Authentication Types
export interface User {
  id: string;
  phoneNumber: string;
  totalCoins: number;
  collectedCoins: string[];
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationId: string | null;
  setUser: (user: User | null) => void;
  setVerificationId: (id: string | null) => void;
  logout: () => void;
}

// Location & Geography Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  position: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

// Coin Types
export interface Coin {
  id: string;
  position: Coordinates;
  value: number;
  createdAt: Date;
  expiresAt?: Date;
}

// Homebase Types
export interface Homebase {
  id: string;
  name: string;
  position: Coordinates;
  address: string;
  plusCode: string;
  description?: string;
}

// Collectible Types
export type CollectibleState = 'locked' | 'unlocked' | 'collected';

export interface Collectible {
  id: string;
  type: string; // e.g., 'person0', 'windmill', 'treasure-chest'
  position: Coordinates;
  state: CollectibleState;
  pointValue: number;
  unlocksCollectible?: string; // ID of collectible this unlocks
  modelSrc: string; // GLB file path
  scale: number;
  orientation: { heading: number; tilt: number; roll: number };
  collectedAt?: Date;
  unlockedAt?: Date;
}

export interface GameState {
  coins: Coin[];
  userCoins: number;
  collectedCoinIds: string[];
  homebases: Homebase[];
  phoenixCoins: number;
  novaCoins: number;
  novaStreakDays: number;
  novaCollectionHistory: Date[];
  phoenixCollectionHistory: Date[];
  collectibles: Collectible[];
  gemsCollected: number;
  setCoins: (coins: Coin[]) => void;
  collectCoin: (coinId: string, value: number) => void;
  addCoins: (coins: Coin[]) => void;
  setCollectibles: (collectibles: Collectible[]) => void;
  unlockCollectible: (collectibleId: string) => void;
  collectCollectible: (collectibleId: string, points: number) => void;
  getCollectibleState: (collectibleId: string) => CollectibleState | null;
  setHomebases: (homebases: Homebase[]) => void;
  addPhoenixCoin: () => void;
  addNovaCoin: () => void;
  addPoints: (points: number) => void;
  addGem: () => void;
}

// Map Types
export interface MapViewState {
  center: Coordinates;
  zoom: number;
  tilt: number;
  heading: number;
}

// Navigation Types
export type NavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};
