import type { Collectible } from '../types';

// Define world collectibles with unlock chains
export const WORLD_COLLECTIBLES: Collectible[] = [
  {
    id: 'person-treasure-1',
    type: 'person0',
    position: { lat: 33.7490, lng: -84.3880 }, // Atlanta coordinates - will be replaced with user position
    state: 'locked',
    pointValue: 47,
    unlocksCollectible: 'windmill-prize-1',
    modelSrc: '/person0.glb',
    scale: 15,
    orientation: { heading: 0, tilt: 0, roll: 0 },
  },
  {
    id: 'windmill-prize-1',
    type: 'windmill',
    position: { lat: 33.7490, lng: -84.3880 }, // Same position as person
    state: 'locked', // Starts locked, unlocked when person is collected
    pointValue: 100,
    modelSrc: '/windmill.glb',
    scale: 0.15,
    orientation: { heading: 0, tilt: 270, roll: 90 },
  },
];

export function getAllCollectibles(): Collectible[] {
  return WORLD_COLLECTIBLES;
}

export function getCollectibleById(id: string): Collectible | undefined {
  return WORLD_COLLECTIBLES.find(c => c.id === id);
}

export function getCollectiblesByState(state: 'locked' | 'unlocked' | 'collected'): Collectible[] {
  return WORLD_COLLECTIBLES.filter(c => c.state === state);
}
