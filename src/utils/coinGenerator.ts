import type { Coin, Coordinates } from '../types';

const COIN_VALUES = [5, 10, 15, 20];
const EARTH_RADIUS_KM = 6371;

/**
 * Generates random coins within a radius around a given location
 * @param center - The center coordinates
 * @param count - Number of coins to generate
 * @param radiusKm - Radius in kilometers (default 0.366km = 1200 feet)
 * @returns Array of generated coins
 */
export function generateCoinsNearLocation(
  center: Coordinates,
  count: number = 10,
  radiusKm: number = 0.366
): Coin[] {
  const coins: Coin[] = [];

  for (let i = 0; i < count; i++) {
    // Generate random angle and distance
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * radiusKm;

    // Convert distance and angle to lat/lng offset
    const latOffset = (distance / EARTH_RADIUS_KM) * (180 / Math.PI);
    const lngOffset =
      (distance / EARTH_RADIUS_KM) *
      (180 / Math.PI) /
      Math.cos(center.lat * Math.PI / 180);

    const lat = center.lat + latOffset * Math.cos(angle);
    const lng = center.lng + lngOffset * Math.sin(angle);

    // Random coin value
    const value = COIN_VALUES[Math.floor(Math.random() * COIN_VALUES.length)];

    coins.push({
      id: `coin_${Date.now()}_${i}`,
      position: { lat, lng },
      value,
      createdAt: new Date(),
    });
  }

  return coins;
}

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param pos1 - First coordinate
 * @param pos2 - Second coordinate
 * @returns Distance in meters
 */
export function calculateDistance(pos1: Coordinates, pos2: Coordinates): number {
  const lat1 = pos1.lat * Math.PI / 180;
  const lat2 = pos2.lat * Math.PI / 180;
  const deltaLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const deltaLng = (pos2.lng - pos1.lng) * Math.PI / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c * 1000; // Convert to meters
}
