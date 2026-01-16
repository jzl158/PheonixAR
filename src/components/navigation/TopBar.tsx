import { useGameStore } from '../../store/gameStore';

export function TopBar() {
  const { userCoins, collectedCoinIds } = useGameStore();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-4 py-3 safe-top bg-gradient-to-b from-black/50 to-transparent">
      <div className="text-sm text-white/90">
        End of Q3
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-white text-lg">🪙</span>
          <span className="text-white font-semibold">{userCoins}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-white text-lg">🏆</span>
          <span className="text-white font-semibold">{collectedCoinIds.length}</span>
        </div>
      </div>
    </div>
  );
}
