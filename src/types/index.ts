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

export interface GameState {
  coins: Coin[];
  userCoins: number;
  collectedCoinIds: string[];
  homebases: Homebase[];
  setCoins: (coins: Coin[]) => void;
  collectCoin: (coinId: string, value: number) => void;
  addCoins: (coins: Coin[]) => void;
  setHomebases: (homebases: Homebase[]) => void;
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
