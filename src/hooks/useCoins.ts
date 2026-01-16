import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import type { Coordinates, Coin } from '../types';
import { fetchActiveCoins, removeCoin, generateAndSaveCoins } from '../services/coinService';
import { calculateDistance } from '../utils/coinGenerator';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';

const COLLECTION_RADIUS_METERS = 152.4; // User must be within 500 feet to collect

export function useCoins(userPosition: Coordinates | null) {
  const { coins, setCoins, collectCoin } = useGameStore();
  const { user } = useAuthStore();
  const initialPositionRef = useRef<Coordinates | null>(null);
  const coinsLoadedRef = useRef(false);

  // Load coins once when user position is first detected
  useEffect(() => {
    const loadCoins = async () => {
      if (!userPosition || coinsLoadedRef.current) return;

      // Store the initial position
      if (!initialPositionRef.current) {
        initialPositionRef.current = userPosition;
        console.log('🎯 Initial position set:', userPosition);
      }

      try {
        // Try to fetch from Firebase first
        try {
          const activeCoins = await fetchActiveCoins();
          setCoins(activeCoins);

          // If no coins exist, generate some at the initial position
          if (activeCoins.length === 0) {
            const newCoins = await generateAndSaveCoins(initialPositionRef.current, 15);
            setCoins(newCoins);
            console.log(`🪙 Generated ${newCoins.length} coins around initial position`);
          }
        } catch (firebaseError) {
          // If Firebase fails, generate local coins for testing
          console.log('Firebase not configured, using local coins for testing');
          const { generateCoinsNearLocation } = await import('../utils/coinGenerator');
          const localCoins = generateCoinsNearLocation(initialPositionRef.current, 15);
          setCoins(localCoins);
          console.log(`🪙 Generated ${localCoins.length} local coins within 1200 feet`);
        }

        coinsLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading coins:', error);
      }
    };

    loadCoins();
  }, [userPosition, setCoins]);

  const attemptCollectCoin = async (coin: Coin) => {
    if (!userPosition || !user) {
      alert('Please allow location access to collect coins');
      return false;
    }

    const distance = calculateDistance(userPosition, coin.position);
    const distanceFeet = Math.round(distance * 3.28084);

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

        // Success feedback
        console.log(`✅ Collected ${coin.value} coins! Total: ${useGameStore.getState().userCoins}`);

        return true;
      } catch (error) {
        console.error('Error collecting coin:', error);
        alert('Failed to collect coin. Please try again.');
        return false;
      }
    } else {
      // Too far away
      alert(`🚶 Too far! You need to be within 500 feet.\n\nCurrent distance: ${distanceFeet} feet\n\nWalk ${distanceFeet - 500} feet closer to collect this coin.`);
      console.log(`Too far from coin. Distance: ${distance.toFixed(0)}m (${distanceFeet} feet)`);
      return false;
    }
  };

  return {
    coins,
    attemptCollectCoin,
  };
}
