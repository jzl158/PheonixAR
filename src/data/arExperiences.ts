import type { ARExperience } from '../types/locations';

// Mock AR Experience locations in Atlanta
export const AR_EXPERIENCES: ARExperience[] = [
  {
    id: 'ar-exp-1',
    type: 'ar-experience',
    title: 'Phoenix Rising AR',
    description: 'Experience a stunning AR visualization of a phoenix rising from the ashes! Stand at this location to unlock the experience.',
    position: {
      lat: 33.8540,
      lng: -84.3820,
    },
    activationType: 'skylark',
    rewardType: 'fungible',
    proximityRequired: 50,
    experienceUrl: '/ar/phoenix-rising',
  },
  {
    id: 'ar-exp-2',
    type: 'ar-experience',
    title: 'Skylark Portal',
    description: 'Open an AR portal to collect exclusive digital items! Visit this location to activate.',
    position: {
      lat: 33.8545,
      lng: -84.3810,
    },
    activationType: 'spark',
    rewardType: 'non-fungible',
    proximityRequired: 50,
    experienceUrl: '/ar/skylark-portal',
  },
  {
    id: 'ar-exp-3',
    type: 'ar-experience',
    title: 'Atlanta Mural AR',
    description: 'See Atlanta street art come to life in augmented reality! Discover hidden animations and stories.',
    position: {
      lat: 33.8550,
      lng: -84.3805,
    },
    activationType: 'claim',
    rewardType: 'fungible',
    proximityRequired: 50,
    experienceUrl: '/ar/atlanta-mural',
  },
];

export function getAllARExperiences(): ARExperience[] {
  return AR_EXPERIENCES;
}
