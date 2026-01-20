import { useState, useEffect, useCallback } from 'react';
import type { PhoenixCoin, NovaCoin } from '../types/locations';
import { generatePhoenixCoins } from '../utils/phoenixCoinGenerator';
import { generateNovaCoins, calculateNovaStreak } from '../utils/novaCoinGenerator';
import { useGameStore } from '../store/gameStore';

interface SpecialCoinsState {
  phoenixCoins: PhoenixCoin[];
  novaCoins: NovaCoin[];
}

export function useSpecialCoins(userPosition: { lat: number; lng: number } | null) {
  const [specialCoins, setSpecialCoins] = useState<SpecialCoinsState>({
    phoenixCoins: [],
    novaCoins: [],
  });

  const {
    addPoints,
    phoenixCoins: phoenixCoinCount,
    addPhoenixCoin,
    novaCoins: novaCoinCount,
    addNovaCoin,
  } = useGameStore();

  // Generate special coins when user position changes
  useEffect(() => {
    if (!userPosition) return;

    console.log('🔮 Generating special coins...');

    // Generate Phoenix Coins (rare - 10% spawn rate)
    const phoenix = generatePhoenixCoins(userPosition, 1000);
    console.log(`🔥 Generated ${phoenix.length} Phoenix Coins (rare)`);

    // Generate Nova Coins (semi-rare - 30% spawn rate)
    const nova = generateNovaCoins(userPosition, 1500);
    console.log(`⭐ Generated ${nova.length} Nova Coins (semi-rare)`);

    setSpecialCoins({
      phoenixCoins: phoenix,
      novaCoins: nova,
    });
  }, [userPosition]);

  // Attempt to collect a Phoenix Coin
  const attemptCollectPhoenixCoin = useCallback(async (coin: PhoenixCoin) => {
    if (!userPosition) {
      console.log('❌ No user position available');
      return false;
    }

    // Calculate distance to coin
    const distance = calculateDistance(
      userPosition.lat,
      userPosition.lng,
      coin.position.lat,
      coin.position.lng
    );

    const distanceInFeet = distance * 3280.84; // Convert km to feet

    console.log(`🔥 Attempting to collect Phoenix Coin. Distance: ${distanceInFeet.toFixed(0)} ft`);

    // Check if within proximity (50 feet for Phoenix Coins)
    if (distanceInFeet > coin.proximityRequired) {
      alert(`🔥 Phoenix Coin is ${distanceInFeet.toFixed(0)} feet away. Get within ${coin.proximityRequired} feet to collect!`);
      return false;
    }

    // Collect the coin
    console.log('✅ Phoenix Coin collected!');
    addPhoenixCoin();
    alert('🔥 Phoenix Coin collected! These rare coins unlock special rewards!');

    // Remove from display
    setSpecialCoins(prev => ({
      ...prev,
      phoenixCoins: prev.phoenixCoins.filter(c => c.id !== coin.id),
    }));

    return true;
  }, [userPosition, addPhoenixCoin]);

  // Attempt to collect a Nova Coin
  const attemptCollectNovaCoin = useCallback(async (coin: NovaCoin) => {
    if (!userPosition) {
      console.log('❌ No user position available');
      return false;
    }

    // Calculate distance to coin
    const distance = calculateDistance(
      userPosition.lat,
      userPosition.lng,
      coin.position.lat,
      coin.position.lng
    );

    const distanceInFeet = distance * 3280.84; // Convert km to feet

    console.log(`⭐ Attempting to collect Nova Coin. Distance: ${distanceInFeet.toFixed(0)} ft`);

    // Check if within proximity (50 feet for Nova Coins)
    if (distanceInFeet > coin.proximityRequired) {
      alert(`⭐ Nova Coin is ${distanceInFeet.toFixed(0)} feet away. Get within ${coin.proximityRequired} feet to collect!`);
      return false;
    }

    // Collect the coin
    console.log('✅ Nova Coin collected! +100 points');
    addNovaCoin();
    addPoints(coin.value);

    // Check if this continues the streak
    // In a real app, we'd check the collection history from the store
    alert('⭐ Nova Coin collected! +100 points\nCollect 1 Nova Coin daily to build your weekly streak!');

    // Remove from display
    setSpecialCoins(prev => ({
      ...prev,
      novaCoins: prev.novaCoins.filter(c => c.id !== coin.id),
    }));

    return true;
  }, [userPosition, addNovaCoin, addPoints]);

  return {
    phoenixCoins: specialCoins.phoenixCoins,
    novaCoins: specialCoins.novaCoins,
    attemptCollectPhoenixCoin,
    attemptCollectNovaCoin,
  };
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
