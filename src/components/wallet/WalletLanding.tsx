import { useGameStore } from '../../store/gameStore';
import { BottomNav } from '../navigation/BottomNav';

interface WalletLandingProps {
  onOpenInventory: () => void;
}

export function WalletLanding({ onOpenInventory }: WalletLandingProps) {
  const { gemsCollected } = useGameStore();

  // Suppress unused variable warning
  void gemsCollected;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0F0728] via-[#1a0f3a] to-[#0F0728] text-white overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">SKYLARK</h1>
        <button className="bg-yellow-400/20 p-2 rounded-full">
          <span className="text-yellow-400 text-2xl">🪙</span>
        </button>
      </div>

      {/* Golden Trophy Hero Image */}
      <div className="px-6 mb-6">
        <div className="relative bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-3xl border-4 border-yellow-600/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
          <div className="relative p-8 flex items-center justify-center min-h-[280px]">
            {/* Trophy Placeholder - will be replaced with actual golden pawn image */}
            <div className="text-9xl filter drop-shadow-2xl">🏆</div>
          </div>
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-500/50"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-500/50"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-500/50"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-500/50"></div>
        </div>
      </div>

      {/* Complete Your Profile Section */}
      <div className="px-6 mb-6">
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5">
          <h2 className="text-lg font-bold mb-4">Complete Your Profile</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Upload A Profile Picture</span>
              <button className="text-yellow-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Activity 2</span>
              <button className="text-yellow-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Activity 3</span>
              <button className="text-yellow-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="px-6 mb-6">
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-5">
          <h2 className="text-lg font-bold mb-3">Recent Activity</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="text-gray-300">Claimed Gems</span>
            </div>
            <button
              onClick={onOpenInventory}
              className="text-yellow-400 text-sm font-semibold"
            >
              + Inventory
            </button>
          </div>
        </div>
      </div>

      {/* Memberships Section - Horizontal Scroll */}
      <div className="mb-6">
        <div className="px-6 mb-4">
          <h2 className="text-xl font-bold">MEMBERSHIPS</h2>
          <p className="text-gray-400 text-sm">Keep up with your favorites</p>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 pb-2">
            {/* Membership Card 1 */}
            <div className="flex-shrink-0 w-72 bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-700/50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500">
                {/* Placeholder for colorful bird image */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  🦚
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Flockin' Feathers</h3>
                  <span className="bg-purple-700 text-xs px-2 py-1 rounded-full">Tier 6</span>
                </div>
              </div>
            </div>

            {/* Membership Card 2 (Placeholder) */}
            <div className="flex-shrink-0 w-72 bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-700/50 rounded-2xl overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  ⭐
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Premium Member</h3>
                  <span className="bg-purple-700 text-xs px-2 py-1 rounded-full">Tier 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nova Activations Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">NOVA ACTIVATIONS</h2>
            <p className="text-gray-400 text-sm">Participate to earn more points and rewards</p>
          </div>
          <button className="text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Activation Card 1 */}
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4">
            <div className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
              Activation
            </div>
            <p className="text-white font-semibold mb-4">Activation 1, Earn $23</p>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-full transition-colors">
              Complete
            </button>
          </div>

          {/* Activation Card 2 */}
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4">
            <div className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
              Activation
            </div>
            <p className="text-white font-semibold mb-4">Activation 2, Earn $45</p>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-full transition-colors">
              Complete
            </button>
          </div>

          {/* Activation Card 3 */}
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4">
            <div className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
              Activation
            </div>
            <p className="text-white font-semibold mb-4">Activation 3, Earn $212</p>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-full transition-colors">
              Complete
            </button>
          </div>

          {/* Activation Card 4 */}
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-4">
            <div className="bg-yellow-400/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
              Activation
            </div>
            <p className="text-white font-semibold mb-4">Activation 4, Earn $47</p>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-full transition-colors">
              Complete
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav />

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
