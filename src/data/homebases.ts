import type { Homebase } from '../types';

// Declare window types for Google Maps API
declare global {
  interface Window {
    GOOGLE_MAPS_API_KEY?: string;
  }
}

// Convert Plus Code to coordinates using Google Maps Geocoding API
// VJ39+MF Atlanta, Georgia = 33.8542635, -84.3833106 (45 Old Ivy Rd NE)

export const HOMEBASES: Homebase[] = [
  {
    id: 'homebase-1',
    name: 'Atlanta Homebase Alpha',
    position: {
      lat: 33.8542635,
      lng: -84.3833106,
    },
    address: '45 Old Ivy Rd NE, Atlanta, GA 30342',
    plusCode: 'VJ39+MF',
    description: 'Primary homebase location in Atlanta',
  },
];

/**
 * Get all homebases
 */
export function getAllHomebases(): Homebase[] {
  return HOMEBASES;
}

/**
 * Get homebase by ID
 */
export function getHomebaseById(id: string): Homebase | undefined {
  return HOMEBASES.find(base => base.id === id);
}

/**
 * Convert Plus Code to coordinates using Google Maps Geocoding API
 * @param plusCode - The Plus Code to convert (e.g., "VJ39+MF")
 * @param locality - The locality/city (e.g., "Atlanta, Georgia")
 * @returns Promise with coordinates
 */
export async function convertPlusCodeToCoordinates(
  plusCode: string,
  locality: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || window.GOOGLE_MAPS_API_KEY;
    const address = `${plusCode} ${locality}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }

    console.error('Geocoding failed:', data.status);
    return null;
  } catch (error) {
    console.error('Error converting Plus Code:', error);
    return null;
  }
}
