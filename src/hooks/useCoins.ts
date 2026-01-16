import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import type { Coordinates, Coin } from '../types';
import { fetchActiveCoins, removeCoin, generateAndSaveCoins } from '../services/coinService';
import { calculateDistance } from '../utils/coinGenerator';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';

const COLLECTION_RADIUS_METERS = 50; // User must be within 50m to collect

export function useCoins(userPosition: Coordinates | null) {
  const { coins, setCoins, collectCoin } = useGameStore();
  const { user } = useAuthStore();

  // Load coins on mount
  useEffect(() => {
    const loadCoins = async () => {
      try {
        // Try to fetch from Firebase first
        try {
          const activeCoins = await fetchActiveCoins();
          setCoins(activeCoins);

          // If no coins exist and we have user position, generate some
          if (activeCoins.length === 0 && userPosition) {
            const newCoins = await generateAndSaveCoins(userPosition, 10);
            setCoins(newCoins);
          }
        } catch (firebaseError) {
          // If Firebase fails, generate local coins for testing
          console.log('Firebase not configured, using local coins for testing');
          if (userPosition) {
            const { generateCoinsNearLocation } = await import('../utils/coinGenerator');
            const localCoins = generateCoinsNearLocation(userPosition, 10);
            setCoins(localCoins);
          }
        }
      } catch (error) {
        console.error('Error loading coins:', error);
      }
    };

    if (userPosition) {
      loadCoins();
    }
  }, [userPosition, setCoins]);

  const attemptCollectCoin = async (coin: Coin) => {
    if (!userPosition || !user) {
      console.log('User position or auth required to collect coins');
      return;
    }

    const distance = calculateDistance(userPosition, coin.position);

    if (distance <= COLLECTION_RADIUS_METERS) {
      try {
        // Try to update Firebase if configured
        try {
          await removeCoin(coin.id);
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, {
            totalCoins: increment(coin.value),
            collectedCoins: [...user.collectedCoins, coin.id],
          });
        } catch (firebaseError) {
          console.log('Firebase not configured, updating local state only');
        }

        // Update local state
        collectCoin(coin.id, coin.value);

        return true;
      } catch (error) {
        console.error('Error collecting coin:', error);
        return false;
      }
    } else {
      console.log(`Too far from coin. Distance: ${distance.toFixed(0)}m`);
      return false;
    }
  };

  return {
    coins,
    attemptCollectCoin,
  };
}
