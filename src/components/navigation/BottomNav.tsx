import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isWalletActive = location.pathname === '/wallet';
  const isMapActive = location.pathname === '/map';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-purple-950/95 backdrop-blur-sm border-t border-purple-800/50 z-50">
      <div className="flex items-center justify-around py-4">
        {/* Wallet Button */}
        <button
          onClick={() => navigate('/wallet')}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-2 rounded-lg ${isWalletActive ? 'bg-yellow-400' : 'bg-purple-800'}`}>
            <svg className={`w-6 h-6 ${isWalletActive ? 'text-gray-900' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span className={`text-xs font-semibold ${isWalletActive ? 'text-yellow-400' : 'text-gray-400'}`}>Wallet</span>
        </button>

        {/* Map Button */}
        <button
          onClick={() => navigate('/map')}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-2 rounded-lg ${isMapActive ? 'bg-yellow-400' : 'bg-purple-800'}`}>
            <svg className={`w-6 h-6 ${isMapActive ? 'text-gray-900' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <span className={`text-xs font-semibold ${isMapActive ? 'text-yellow-400' : 'text-gray-400'}`}>Map</span>
        </button>

        {/* Check In Button (Coming Soon) */}
        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-full transition-colors">
          Check In (Coming Soon)
        </button>
      </div>
    </div>
  );
}
