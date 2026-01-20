import { create } from 'zustand';
import type { GameState, Coin, Homebase } from '../types';

export const useGameStore = create<GameState>((set) => ({
  coins: [],
  userCoins: 0,
  collectedCoinIds: [],
  homebases: [],
  phoenixCoins: 0,
  novaCoins: 0,
  novaStreakDays: 0,
  novaCollectionHistory: [],
  phoenixCollectionHistory: [],

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

  addPhoenixCoin: () => {
    set((state) => ({
      phoenixCoins: state.phoenixCoins + 1,
      phoenixCollectionHistory: [...state.phoenixCollectionHistory, new Date()],
    }));
  },

  addNovaCoin: () => {
    set((state) => {
      const now = new Date();
      const newHistory = [...state.novaCollectionHistory, now];

      // Calculate streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let streak = 0;
      let checkDate = new Date(today);

      const sorted = [...newHistory].sort((a, b) => b.getTime() - a.getTime());

      for (const collectionDate of sorted) {
        const collection = new Date(collectionDate);
        collection.setHours(0, 0, 0, 0);

        if (collection.getTime() === checkDate.getTime()) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (collection.getTime() < checkDate.getTime()) {
          break;
        }
      }

      return {
        novaCoins: state.novaCoins + 1,
        novaCollectionHistory: newHistory,
        novaStreakDays: streak,
      };
    });
  },

  addPoints: (points: number) => {
    set((state) => ({
      userCoins: state.userCoins + points,
    }));
  },
}));
