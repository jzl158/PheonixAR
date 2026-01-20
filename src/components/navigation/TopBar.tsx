import { useGameStore } from '../../store/gameStore';

interface TopBarProps {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function TopBar({ onNotificationClick, onProfileClick }: TopBarProps) {
  const { userCoins, collectedCoinIds, phoenixCoins, novaCoins } = useGameStore();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 py-3 safe-top bg-gradient-to-b from-black/50 to-transparent">
      {/* Left Side - Notification Button */}
      <button
        onClick={onNotificationClick}
        className="bg-black/60 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
      >
        <span className="text-white text-xl">🔔</span>
      </button>

      {/* Center - Coin Balances */}
      <div className="flex items-center gap-2">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-white text-lg">🪙</span>
          <span className="text-white font-semibold">{userCoins}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-white text-lg">🔥</span>
          <span className="text-white font-semibold">{phoenixCoins}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-white text-lg">⭐</span>
          <span className="text-white font-semibold">{novaCoins}</span>
        </div>
      </div>

      {/* Right Side - Profile Button */}
      <button
        onClick={onProfileClick}
        className="bg-black/60 backdrop-blur-sm rounded-full p-2 hover:bg-black/70 transition-colors"
      >
        <span className="text-white text-xl">🦅</span>
      </button>
    </div>
  );
}
