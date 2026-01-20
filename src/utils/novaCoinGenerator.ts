import type { NovaCoin } from '../types/locations';

// Nova Coins are SEMI-RARE - appear sometimes
// Worth 100 points
// Collecting 1 a day builds your Nova Streak for the week
export function generateNovaCoins(
  center: { lat: number; lng: number },
  radiusInMeters: number = 1500
): NovaCoin[] {
  const coins: NovaCoin[] = [];

  // Semi-rare spawn rate - 30% chance to spawn
  if (Math.random() > 0.3) {
    return coins;
  }

  // If we do spawn, create 1-3 coins
  const count = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusInMeters;

    const latOffset = (distance / 111320) * Math.cos(angle);
    const lngOffset = (distance / (111320 * Math.cos((center.lat * Math.PI) / 180))) * Math.sin(angle);

    coins.push({
      id: `nova-${Date.now()}-${i}`,
      type: 'nova-coin',
      value: 100,
      position: {
        lat: center.lat + latOffset,
        lng: center.lng + lngOffset,
      },
      activationType: 'instant-claim',
      rewardType: 'fungible',
      proximityRequired: 50,
      rarity: 'semi-rare',
      dailyStreak: false,
    });
  }

  return coins;
}

// Calculate Nova Streak
export interface NovaStreakData {
  currentStreak: number;
  weeklyCollections: Date[];
  lastCollectionDate: Date | null;
}

export function calculateNovaStreak(collectionHistory: Date[]): NovaStreakData {
  if (collectionHistory.length === 0) {
    return {
      currentStreak: 0,
      weeklyCollections: [],
      lastCollectionDate: null,
    };
  }

  // Sort by date descending
  const sorted = [...collectionHistory].sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);

  // Check consecutive days
  for (const collectionDate of sorted) {
    const collection = new Date(collectionDate);
    collection.setHours(0, 0, 0, 0);

    if (collection.getTime() === checkDate.getTime()) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (collection.getTime() < checkDate.getTime()) {
      break;
    }
  }

  // Get this week's collections (Monday - Sunday)
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyCollections = collectionHistory.filter(date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d >= startOfWeek;
  });

  return {
    currentStreak,
    weeklyCollections,
    lastCollectionDate: sorted[0] || null,
  };
}

// Check if player has collected a Nova Coin today
export function hasCollectedNovaCoinToday(collectionHistory: Date[]): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return collectionHistory.some(date => {
    const collectionDate = new Date(date);
    collectionDate.setHours(0, 0, 0, 0);
    return collectionDate.getTime() === today.getTime();
  });
}

// Check if collecting this Nova Coin counts toward daily streak
export function isStreakEligible(collectionHistory: Date[]): boolean {
  return !hasCollectedNovaCoinToday(collectionHistory);
}
