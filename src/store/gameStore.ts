import { create } from 'zustand';
import type { GameState, Coin, Homebase } from '../types';

export const useGameStore = create<GameState>((set) => ({
  coins: [],
  userCoins: 0,
  collectedCoinIds: [],
  homebases: [],

  setCoins: (coins: Coin[]) => {
    set({ coins });
  },

  collectCoin: (coinId: string, value: number) => {
    set((state) => ({
      userCoins: state.userCoins + value,
      collectedCoinIds: [...state.collectedCoinIds, coinId],
      coins: state.coins.filter(coin => coin.id !== coinId),
    }));
  },

  addCoins: (newCoins: Coin[]) => {
    set((state) => ({
      coins: [...state.coins, ...newCoins],
    }));
  },

  setHomebases: (homebases: Homebase[]) => {
    set({ homebases });
  },
}));
