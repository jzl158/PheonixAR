import type { Grillz, LPWChicken } from '../types/locations';

// Mock Grillz locations in Atlanta
export const GRILLZ_LOCATIONS: Grillz[] = [
  {
    id: 'grillz-1',
    type: 'grillz',
    name: 'Golden Grillz Spot',
    description: 'Visit this highlighted location to get yourself a Grill! Complete the activation to claim your reward.',
    position: {
      lat: 33.8546,
      lng: -84.3822,
    },
    activationType: 'assorted',
    rewardType: 'limited-quantity',
    proximityRequired: 50,
  },
  {
    id: 'grillz-2',
    type: 'grillz',
    name: 'Diamond Grillz Zone',
    description: 'Exclusive grillz available at this location! Be one of the first to claim this Atlanta gem.',
    position: {
      lat: 33.8552,
      lng: -84.3814,
    },
    activationType: 'assorted',
    rewardType: 'limited-quantity',
    proximityRequired: 50,
  },
];

// Mock Lemon Pepper Wet Chicken locations in Atlanta
export const LPW_CHICKEN_LOCATIONS: LPWChicken[] = [
  {
    id: 'lpw-1',
    type: 'lpw-chicken',
    name: 'Lemon Pepper Paradise',
    description: 'Find that Lemon Pepper Wet at this highlighted location! A true Atlanta culinary experience.',
    position: {
      lat: 33.8544,
      lng: -84.3816,
    },
    activationType: 'assorted',
    rewardType: 'limited-quantity',
    proximityRequired: 50,
  },
  {
    id: 'lpw-2',
    type: 'lpw-chicken',
    name: 'LPW Central',
    description: 'The best Lemon Pepper Wet in the city! Visit this location to claim your reward.',
    position: {
      lat: 33.8549,
      lng: -84.3811,
    },
    activationType: 'assorted',
    rewardType: 'limited-quantity',
    proximityRequired: 50,
  },
];

export function getAllGrillz(): Grillz[] {
  return GRILLZ_LOCATIONS;
}

export function getAllLPWChicken(): LPWChicken[] {
  return LPW_CHICKEN_LOCATIONS;
}
