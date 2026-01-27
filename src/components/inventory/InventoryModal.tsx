import { useGameStore } from '../../store/gameStore';

interface InventoryModalProps {
  onClose: () => void;
}

export function InventoryModal({ onClose }: InventoryModalProps) {
  const { gemsCollected } = useGameStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full shadow-2xl border-2 border-purple-500/50">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl hover:scale-110 transition-transform"
          >
            ✕
          </button>
          <h2 className="text-white text-2xl font-bold text-center">Inventory</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Gems Section */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">💎</div>
                  <div>
                    <h3 className="text-white font-semibold">Gems Collected</h3>
                    <p className="text-gray-400 text-sm">
                      {gemsCollected > 0 ? 'Unlocked from Mario Brick' : 'Not yet unlocked'}
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-400">{gemsCollected}</div>
              </div>
            </div>

            {/* Placeholder for future items */}
            {gemsCollected === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎒</div>
                <p className="text-gray-400">Complete missions to unlock items!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
