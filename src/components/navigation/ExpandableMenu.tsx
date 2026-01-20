import { useState } from 'react';

interface ExpandableMenuProps {
  onPinClick: () => void;
  onPhoenixClick: () => void;
  onLeaderboardClick: () => void;
  onFriendsClick: () => void;
  onChatClick: () => void;
}

export function ExpandableMenu({
  onPinClick,
  onPhoenixClick,
  onLeaderboardClick,
  onFriendsClick,
  onChatClick,
}: ExpandableMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center items-center z-50 pointer-events-none">
      <div className="relative flex items-center justify-center pointer-events-auto">
        {/* Left side menu items */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
          }`}
        >
          {/* Pin - Map View */}
          <button
            onClick={() => {
              onPinClick();
              setIsExpanded(false);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            title="Map View"
          >
            📍
          </button>

          {/* Phoenix - Offers */}
          <button
            onClick={() => {
              onPhoenixClick();
              setIsExpanded(false);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            title="Phoenix Offers"
          >
            🔥
          </button>
        </div>

        {/* Center Trophy Button */}
        <button
          onClick={toggleMenu}
          className={`w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-2xl flex items-center justify-center text-3xl mx-3 hover:scale-105 transition-all ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
          title={isExpanded ? 'Close Menu' : 'Open Menu'}
        >
          🏆
        </button>

        {/* Right side menu items */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
          }`}
        >
          {/* Leaderboard */}
          <button
            onClick={() => {
              onLeaderboardClick();
              setIsExpanded(false);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            title="Leaderboard"
          >
            🏅
          </button>

          {/* Friends */}
          <button
            onClick={() => {
              onFriendsClick();
              setIsExpanded(false);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            title="Friends"
          >
            👥
          </button>

          {/* Chat */}
          <button
            onClick={() => {
              onChatClick();
              setIsExpanded(false);
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            title="Chat"
          >
            💬
          </button>
        </div>
      </div>
    </div>
  );
}
