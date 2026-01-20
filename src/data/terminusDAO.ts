import type { TerminusDAO } from '../types/locations';

// Mock Terminus DAO Stop locations in Atlanta
export const TERMINUS_DAO_STOPS: TerminusDAO[] = [
  {
    id: 'terminus-1',
    type: 'terminus-dao',
    name: 'Terminus Alpha',
    description: 'Visit this Terminus DAO stop to participate in location-based activations and earn exclusive badges!',
    position: {
      lat: 33.8538,
      lng: -84.3818,
    },
    activationType: 'assorted',
    rewardType: 'badge',
    proximityRequired: 50,
    badges: ['terminus-explorer', 'dao-initiate'],
  },
  {
    id: 'terminus-2',
    type: 'terminus-dao',
    name: 'Terminus Beta',
    description: 'Complete challenges at this Terminus DAO location to unlock special rewards and community badges.',
    position: {
      lat: 33.8542,
      lng: -84.3812,
    },
    activationType: 'assorted',
    rewardType: 'badge',
    proximityRequired: 50,
    badges: ['terminus-challenger', 'community-builder'],
  },
];

export function getAllTerminusDAOStops(): TerminusDAO[] {
  return TERMINUS_DAO_STOPS;
}
