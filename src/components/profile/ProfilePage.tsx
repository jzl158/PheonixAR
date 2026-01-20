import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { Quest } from '../../types/locations';

interface ProfilePageProps {
  onClose: () => void;
}

// Mock quests for demonstration
const MOCK_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Daily Check-In',
    description: 'Open the app and collect your daily bonus!',
    type: 'daily-check-in',
    pointsReward: 50,
    progress: 1,
    total: 1,
    completed: true,
  },
  {
    id: 'quest-2',
    title: 'Collect 10 GSKY Tokens',
    description: 'Find and collect 10 GSKY tokens around Atlanta',
    type: 'challenge',
    pointsReward: 100,
    progress: 6,
    total: 10,
    completed: false,
  },
  {
    id: 'quest-3',
    title: 'Atlanta Explorer',
    description: 'Visit 3 different homebases in the city',
    type: 'challenge',
    pointsReward: 200,
    progress: 1,
    total: 3,
    completed: false,
  },
  {
    id: 'quest-4',
    title: 'Community Poll',
    description: 'Share your opinion on the future of Phoenix!',
    type: 'poll',
    pointsReward: 75,
    progress: 0,
    total: 1,
    completed: false,
  },
];

type OfferCategory = 'unused' | 'used' | 'expired' | 'all';

export function ProfilePage({ onClose }: ProfilePageProps) {
  const { userCoins, phoenixCoins, novaCoins, novaStreakDays } = useGameStore();
  const [selectedTab, setSelectedTab] = useState<'quests' | 'offers'>('quests');
  const [offerCategory, setOfferCategory] = useState<OfferCategory>('unused');

  // Mock user data
  const userData = {
    name: 'Phoenix Player',
    username: '@skylark_user',
    profileImage: '🦅',
    level: 12,
    followers: 156,
    following: 89,
    experienceProgress: 65, // percentage to next level
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-primary-600 to-primary-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl hover:scale-110 transition-transform"
          >
            ✕
          </button>

          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl">
                {userData.profileImage}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                Lv {userData.level}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">{userData.name}</h2>
              <p className="text-gray-300 text-sm">{userData.username}</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gray-200">
                  <span className="font-bold">{userData.followers}</span> Followers
                </span>
                <span className="text-gray-200">
                  <span className="font-bold">{userData.following}</span> Following
                </span>
              </div>
            </div>
          </div>

          {/* Balance Display */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
              <div className="text-2xl">🪙</div>
              <div className="text-white font-bold text-lg">{userCoins}</div>
              <div className="text-gray-200 text-xs">GSKY</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
              <div className="text-2xl">🔥</div>
              <div className="text-white font-bold text-lg">{phoenixCoins}</div>
              <div className="text-gray-200 text-xs">Phoenix</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
              <div className="text-2xl">⭐</div>
              <div className="text-white font-bold text-lg">{novaStreakDays}</div>
              <div className="text-gray-200 text-xs">Streak</div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-white text-sm mb-1">
              <span>Level {userData.level}</span>
              <span>{userData.experienceProgress}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${userData.experienceProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setSelectedTab('quests')}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              selectedTab === 'quests'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Quest Board
          </button>
          <button
            onClick={() => setSelectedTab('offers')}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${
              selectedTab === 'offers'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Offers
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {selectedTab === 'quests' ? (
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Active Quests</h3>
              <div className="space-y-3">
                {MOCK_QUESTS.map((quest) => (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-lg ${
                      quest.completed
                        ? 'bg-green-900 bg-opacity-30 border border-green-500'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{quest.title}</h4>
                        <p className="text-gray-400 text-sm">{quest.description}</p>
                      </div>
                      {quest.completed ? (
                        <span className="text-2xl">✅</span>
                      ) : (
                        <span className="text-yellow-400 font-bold">+{quest.pointsReward}</span>
                      )}
                    </div>
                    {!quest.completed && quest.progress !== undefined && quest.total !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>
                            {quest.progress}/{quest.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                            style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Offer Categories */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {(['unused', 'used', 'expired', 'all'] as OfferCategory[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setOfferCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      offerCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Offers List */}
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-gray-400">No {offerCategory} offers yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Collect Phoenix coins and complete challenges to unlock offers!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Settings Footer */}
        <div className="border-t border-gray-700 p-4">
          <button className="w-full text-left text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-between">
            <span>⚙️ Settings</span>
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
