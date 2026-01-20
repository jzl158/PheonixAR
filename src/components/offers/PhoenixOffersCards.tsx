import { useState } from 'react';
import type { Offer } from '../../types/locations';

interface PhoenixOffersCardsProps {
  onClose: () => void;
}

// Mock offers for demonstration
const MOCK_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    type: 'offer',
    title: '$10 Off Your Next Purchase',
    description: 'Visit Ponce City Market and show this offer to get $10 off any purchase over $30!',
    merchantName: 'Ponce City Market',
    merchantImage: '🏪',
    value: 10,
    requiredLevel: 5,
    position: {
      lat: 33.7726,
      lng: -84.3652,
    },
    activationType: 'assorted',
    rewardType: 'fungible',
    proximityRequired: 50,
    status: 'unused',
  },
  {
    id: 'offer-2',
    type: 'offer',
    title: 'Free Coffee with Any Pastry',
    description: 'Enjoy a complimentary coffee when you buy any pastry at Octane Coffee!',
    merchantName: 'Octane Coffee',
    merchantImage: '☕',
    value: 5,
    requiredLevel: 3,
    position: {
      lat: 33.7785,
      lng: -84.3694,
    },
    activationType: 'assorted',
    rewardType: 'fungible',
    proximityRequired: 50,
    status: 'unused',
  },
  {
    id: 'offer-3',
    type: 'offer',
    title: '20% Off Entire Order',
    description: 'Get 20% off your entire order at The Varsity! A true Atlanta classic.',
    merchantName: 'The Varsity',
    merchantImage: '🍔',
    value: 15,
    requiredLevel: 10,
    position: {
      lat: 33.7717,
      lng: -84.3899,
    },
    activationType: 'assorted',
    rewardType: 'fungible',
    proximityRequired: 50,
    status: 'unused',
  },
  {
    id: 'offer-4',
    type: 'offer',
    title: 'Free Admission',
    description: 'Free entry to the Atlanta Botanical Garden for you and a guest!',
    merchantName: 'Atlanta Botanical Garden',
    merchantImage: '🌺',
    value: 40,
    requiredLevel: 15,
    position: {
      lat: 33.7903,
      lng: -84.3726,
    },
    activationType: 'assorted',
    rewardType: 'fungible',
    proximityRequired: 50,
    status: 'unused',
  },
];

export function PhoenixOffersCards({ onClose }: PhoenixOffersCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentOffer = MOCK_OFFERS[currentIndex];

  // Calculate distance (mock - in real app would use actual user location)
  const distance = `${(Math.random() * 5 + 0.5).toFixed(1)} mi`;

  const handleNext = () => {
    if (currentIndex < MOCK_OFFERS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClaim = () => {
    alert(`To claim this offer, get within ${currentOffer.proximityRequired} feet of ${currentOffer.merchantName}!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-600 to-red-600">
        <h2 className="text-white text-xl font-bold">🔥 Phoenix Offers</h2>
        <button
          onClick={onClose}
          className="text-white text-2xl hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>

      {/* Card Counter */}
      <div className="text-center py-3 bg-gray-900">
        <p className="text-gray-300 text-sm">
          {currentIndex + 1} of {MOCK_OFFERS.length}
        </p>
      </div>

      {/* Swipeable Card Area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-sm">
          {/* Main Offer Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Merchant Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-center">
              <div className="text-6xl mb-2">{currentOffer.merchantImage}</div>
              <h3 className="text-white text-xl font-bold">{currentOffer.merchantName}</h3>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white">
                  📍 {distance} away
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white">
                  Lv {currentOffer.requiredLevel}+
                </span>
              </div>
            </div>

            {/* Offer Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-600 text-white text-3xl font-bold px-6 py-3 rounded-full mb-3">
                  ${currentOffer.value} VALUE
                </div>
              </div>

              <h4 className="text-white text-2xl font-bold mb-3 text-center">
                {currentOffer.title}
              </h4>

              <p className="text-gray-300 text-center mb-6">
                {currentOffer.description}
              </p>

              {/* Location Info */}
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📍</span>
                  <span className="text-white font-semibold">{currentOffer.merchantName}</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Get within {currentOffer.proximityRequired} feet to claim this offer
                </p>
              </div>

              {/* Fine Print */}
              <button className="w-full text-gray-400 text-sm underline hover:text-gray-300 transition-colors mb-4">
                Read fine details
              </button>

              {/* Claim Button */}
              <button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                🔥 Claim Offer
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                currentIndex === 0
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-white text-gray-900 hover:scale-105 shadow-lg'
              }`}
            >
              ‹ Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === MOCK_OFFERS.length - 1}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                currentIndex === MOCK_OFFERS.length - 1
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-white text-gray-900 hover:scale-105 shadow-lg'
              }`}
            >
              Next ›
            </button>
          </div>

          {/* Swipe Indicator */}
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">Swipe or use buttons to browse offers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
