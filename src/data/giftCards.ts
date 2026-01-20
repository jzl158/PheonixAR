import type { GiftCard } from '../types/locations';

// Mock Gift Card locations in Atlanta
export const GIFT_CARDS: GiftCard[] = [
  {
    id: 'gift-card-1',
    type: 'gift-card',
    title: '$25 Starbucks Gift Card',
    description: 'Visit this location and complete the activation to win a $25 Starbucks gift card!',
    merchantName: 'Starbucks',
    merchantImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
    value: 25,
    position: {
      lat: 33.8543,
      lng: -84.3815,
    },
    activationType: 'skylark',
    rewardType: 'fungible',
    proximityRequired: 50,
    code: 'SKYLARK25',
  },
  {
    id: 'gift-card-2',
    type: 'gift-card',
    title: '$50 Amazon Gift Card',
    description: 'Complete the challenge at this location to enter for a chance to win a $50 Amazon gift card!',
    merchantName: 'Amazon',
    value: 50,
    position: {
      lat: 33.8535,
      lng: -84.3825,
    },
    activationType: 'skylark',
    rewardType: 'non-fungible',
    proximityRequired: 50,
  },
  {
    id: 'gift-card-3',
    type: 'gift-card',
    title: '$15 Chipotle Gift Card',
    description: 'Visit this location to claim your $15 Chipotle gift card!',
    merchantName: 'Chipotle',
    value: 15,
    position: {
      lat: 33.8548,
      lng: -84.3808,
    },
    activationType: 'skylark',
    rewardType: 'fungible',
    proximityRequired: 50,
    code: 'PHOENIX15',
  },
];

export function getAllGiftCards(): GiftCard[] {
  return GIFT_CARDS;
}
