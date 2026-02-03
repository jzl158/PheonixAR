/**
 * Google Roads API Service
 * Snaps GPS coordinates to nearest road segments to keep game pieces on streets
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const ROADS_API_BASE_URL = 'https://roads.googleapis.com/v1/nearestRoads';

interface SnappedPosition {
  lat: number;
  lng: number;
  placeId?: string;
}

interface RoadsAPIResponse {
  snappedPoints?: Array<{
    location: {
      latitude: number;
      longitude: number;
    };
    placeId?: string;
    originalIndex?: number;
  }>;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 First latitude
 * @param lng1 First longitude
 * @param lat2 Second latitude
 * @param lng2 Second longitude
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Snap GPS coordinates to nearest road using Google Roads API
 * @param lat Latitude
 * @param lng Longitude
 * @returns Snapped position or null if failed
 */
export async function snapToNearestRoad(
  lat: number,
  lng: number
): Promise<SnappedPosition | null> {
  try {
    const url = `${ROADS_API_BASE_URL}?points=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

    console.log(`🛣️ Roads API: Snapping position (${lat.toFixed(6)}, ${lng.toFixed(6)})`);

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`⚠️ Roads API HTTP error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: RoadsAPIResponse = await response.json();

    // Check for API error response
    if (data.error) {
      console.warn(`⚠️ Roads API error: ${data.error.code} - ${data.error.message}`);
      return null;
    }

    // Check if we got snapped points
    if (!data.snappedPoints || data.snappedPoints.length === 0) {
      console.warn('⚠️ Roads API: No road found near coordinates');
      return null;
    }

    const snappedPoint = data.snappedPoints[0];
    const snappedPosition: SnappedPosition = {
      lat: snappedPoint.location.latitude,
      lng: snappedPoint.location.longitude,
      placeId: snappedPoint.placeId,
    };

    const distanceMoved = haversineDistance(
      lat,
      lng,
      snappedPosition.lat,
      snappedPosition.lng
    );

    console.log(
      `✅ Roads API: Snapped to road (moved ${distanceMoved.toFixed(1)}m)`,
      snappedPosition
    );

    return snappedPosition;
  } catch (error) {
    console.error('❌ Roads API: Network error', error);
    return null;
  }
}
