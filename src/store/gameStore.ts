import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Coin, Homebase, Collectible } from '../types';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: [],
      userCoins: 0,
      collectedCoinIds: [],
      homebases: [],
      phoenixCoins: 0,
      novaCoins: 0,
      novaStreakDays: 0,
      novaCollectionHistory: [],
      phoenixCollectionHistory: [],
      collectibles: [],

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

  setCollectibles: (collectibles: Collectible[]) => {
    set({ collectibles });
  },

  unlockCollectible: (collectibleId: string) => {
    set((state) => ({
      collectibles: state.collectibles.map(c =>
        c.id === collectibleId
          ? { ...c, state: 'unlocked' as const, unlockedAt: new Date() }
          : c
      ),
    }));
    console.log(`🔓 Unlocked collectible: ${collectibleId}`);
  },

  collectCollectible: (collectibleId: string, points: number) => {
    const collectible = get().collectibles.find(c => c.id === collectibleId);

    set((state) => ({
      userCoins: state.userCoins + points,
      collectibles: state.collectibles.map(c =>
        c.id === collectibleId
          ? { ...c, state: 'collected' as const, collectedAt: new Date() }
          : c
      ),
    }));

    console.log(`✅ Collected: ${collectibleId} (+${points} points)`);

    // If this collectible unlocks another, unlock it now
    if (collectible?.unlocksCollectible) {
      get().unlockCollectible(collectible.unlocksCollectible);
    }
  },

  getCollectibleState: (collectibleId: string) => {
    const collectible = get().collectibles.find(c => c.id === collectibleId);
    return collectible?.state || null;
  },
}),
{
  name: 'skylark-game-storage',
  partialize: (state) => ({
    userCoins: state.userCoins,
    collectedCoinIds: state.collectedCoinIds,
    phoenixCoins: state.phoenixCoins,
    novaCoins: state.novaCoins,
    novaStreakDays: state.novaStreakDays,
    novaCollectionHistory: state.novaCollectionHistory,
    phoenixCollectionHistory: state.phoenixCollectionHistory,
    collectibles: state.collectibles,
  }),
}
));
