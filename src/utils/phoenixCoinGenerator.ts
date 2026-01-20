import type { PhoenixCoin } from '../types/locations';

// Phoenix Coins are RARE - appear seldomly
// Generate 1-2 Phoenix Coins within a radius
export function generatePhoenixCoins(
  center: { lat: number; lng: number },
  radiusInMeters: number = 1000
): PhoenixCoin[] {
  const coins: PhoenixCoin[] = [];

  // Very low spawn rate - only 10% chance to spawn any at all
  if (Math.random() > 0.1) {
    return coins;
  }

  // If we do spawn, create 1-2 coins
  const count = Math.random() < 0.7 ? 1 : 2;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusInMeters;

    const latOffset = (distance / 111320) * Math.cos(angle);
    const lngOffset = (distance / (111320 * Math.cos((center.lat * Math.PI) / 180))) * Math.sin(angle);

    coins.push({
      id: `phoenix-${Date.now()}-${i}`,
      type: 'phoenix-coin',
      position: {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset,
      },
      activationType: 'instant-claim',
      rewardType: 'fungible',
      proximityRequired: 50,
      rarity: 'rare',
    });
  }

  return coins;
}

// Check if player has collected a Phoenix Coin today
export function hasCollectedPhoenixCoinToday(collectionHistory: Date[]): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return collectionHistory.some(date => {
    const collectionDate = new Date(date);
    collectionDate.setHours(0, 0, 0, 0);
    return collectionDate.getTime() === today.getTime();
  });
}
