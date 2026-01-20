import { useState } from 'react';

interface LeaderboardProps {
  onClose: () => void;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  gSkyPoints: number;
  level: number;
  isCurrentUser?: boolean;
}

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'PhoenixMaster', avatar: '🔥', gSkyPoints: 125000, level: 45 },
  { rank: 2, username: 'SkyRunner23', avatar: '🦅', gSkyPoints: 118500, level: 42 },
  { rank: 3, username: 'NovaCollector', avatar: '⭐', gSkyPoints: 112300, level: 40 },
  { rank: 4, username: 'AtlantaExplorer', avatar: '🗺️', gSkyPoints: 98700, level: 38 },
  { rank: 5, username: 'CoinHunter', avatar: '🪙', gSkyPoints: 87500, level: 35 },
  { rank: 6, username: 'You', avatar: '🦅', gSkyPoints: 76200, level: 32, isCurrentUser: true },
  { rank: 7, username: 'QuestMaster', avatar: '⚔️', gSkyPoints: 72100, level: 31 },
  { rank: 8, username: 'BadgeCollector', avatar: '🏅', gSkyPoints: 68900, level: 30 },
  { rank: 9, username: 'StreakKeeper', avatar: '🔥', gSkyPoints: 65400, level: 29 },
  { rank: 10, username: 'MapWanderer', avatar: '🧭', gSkyPoints: 61200, level: 28 },
];

type LeaderboardPeriod = 'daily' | 'weekly' | 'all-time';

export function Leaderboard({ onClose }: LeaderboardProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-700 to-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">🏅 Leaderboard</h2>
            <button
              onClick={onClose}
              className="text-white text-2xl hover:scale-110 transition-transform"
            >
              ✕
            </button>
          </div>

          {/* Period Tabs */}
          <div className="flex gap-2">
            {(['daily', 'weekly', 'all-time'] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  period === p
                    ? 'bg-white text-gray-900'
                    : 'text-white bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                {p === 'all-time' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="flex items-end justify-center gap-2">
            {/* 2nd Place */}
            {MOCK_LEADERBOARD[1] && (
              <div className="flex flex-col items-center flex-1">
                <div className="text-4xl mb-2">{MOCK_LEADERBOARD[1].avatar}</div>
                <div className="w-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-t-lg p-3 text-center">
                  <div className="text-2xl mb-1">🥈</div>
                  <p className="text-white font-bold text-sm truncate">
                    {MOCK_LEADERBOARD[1].username}
                  </p>
                  <p className="text-gray-200 text-xs">
                    {(MOCK_LEADERBOARD[1].gSkyPoints / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="w-full h-16 bg-gray-600" />
              </div>
            )}

            {/* 1st Place */}
            {MOCK_LEADERBOARD[0] && (
              <div className="flex flex-col items-center flex-1">
                <div className="text-5xl mb-2">{MOCK_LEADERBOARD[0].avatar}</div>
                <div className="w-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-t-lg p-4 text-center">
                  <div className="text-3xl mb-1">🥇</div>
                  <p className="text-white font-bold truncate">
                    {MOCK_LEADERBOARD[0].username}
                  </p>
                  <p className="text-yellow-100 text-sm">
                    {(MOCK_LEADERBOARD[0].gSkyPoints / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="w-full h-24 bg-yellow-700" />
              </div>
            )}

            {/* 3rd Place */}
            {MOCK_LEADERBOARD[2] && (
              <div className="flex flex-col items-center flex-1">
                <div className="text-4xl mb-2">{MOCK_LEADERBOARD[2].avatar}</div>
                <div className="w-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-t-lg p-3 text-center">
                  <div className="text-2xl mb-1">🥉</div>
                  <p className="text-white font-bold text-sm truncate">
                    {MOCK_LEADERBOARD[2].username}
                  </p>
                  <p className="text-orange-100 text-xs">
                    {(MOCK_LEADERBOARD[2].gSkyPoints / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="w-full h-12 bg-orange-700" />
              </div>
            )}
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-700">
            {MOCK_LEADERBOARD.slice(3).map((entry) => (
              <div
                key={entry.rank}
                className={`p-4 flex items-center gap-3 ${
                  entry.isCurrentUser
                    ? 'bg-primary-900 bg-opacity-30 border-l-4 border-primary-500'
                    : 'hover:bg-gray-800 transition-colors'
                }`}
              >
                {/* Rank */}
                <div className="w-12 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(
                      entry.rank
                    )} text-white font-bold`}
                  >
                    #{entry.rank}
                  </div>
                </div>

                {/* Avatar & Info */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="text-3xl">{entry.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-primary-400">(You)</span>
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">Level {entry.level}</p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-white font-bold">
                    {(entry.gSkyPoints / 1000).toFixed(1)}K
                  </p>
                  <p className="text-gray-400 text-xs">GSKY</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <p className="text-gray-400 text-xs text-center">
            Compete with players across Atlanta to climb the ranks!
          </p>
        </div>
      </div>
    </div>
  );
}
