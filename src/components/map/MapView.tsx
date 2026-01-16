import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCoins } from '../../hooks/useCoins';
import { TopBar } from '../navigation/TopBar';
import { BottomNav } from '../navigation/BottomNav';
import type { Coin } from '../../types';

// Declare custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': any;
    }
  }
}

export function MapView() {
  const { position, isLoading, error } = useGeolocation();
  const { coins, attemptCollectCoin } = useCoins(position);
  const mapRef = useRef<HTMLElement | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<HTMLDivElement[]>([]);

  // Wait for map to be ready
  useEffect(() => {
    if (!mapRef.current) return;

    const checkMapReady = setInterval(() => {
      if (mapRef.current && (mapRef.current as any).map) {
        setIsMapReady(true);
        clearInterval(checkMapReady);
      }
    }, 100);

    return () => clearInterval(checkMapReady);
  }, []);

  // Add coin markers as HTML overlays
  useEffect(() => {
    if (!isMapReady || !coins.length || !position) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    coins.forEach((coin: Coin) => {
      const marker = document.createElement('div');
      marker.style.cssText = `
        position: absolute;
        cursor: pointer;
        z-index: 10;
        pointer-events: auto;
      `;

      marker.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateX(-50%) translateY(-100%);
        ">
          <div style="
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            border: 3px solid #d97706;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 18px;
            box-shadow: 0 6px 20px rgba(251, 191, 36, 0.6), 0 3px 8px rgba(0,0,0,0.3);
            animation: coinFloat 2s ease-in-out infinite;
          ">
            ${coin.value}
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid #d97706;
            margin-top: -3px;
          "></div>
        </div>
      `;

      // Click handler
      marker.addEventListener('click', async (e) => {
        e.stopPropagation();
        const success = await attemptCollectCoin(coin);
        if (success) {
          marker.style.animation = 'coinCollect 0.6s ease-out forwards';
          setTimeout(() => marker.remove(), 600);
        }
      });

      // Calculate position on screen (simplified - positions relative to map center)
      const map = mapRef.current;
      if (map) {
        const mapRect = map.getBoundingClientRect();

        // Simple positioning based on lat/lng offset from center
        const latDiff = coin.position.lat - position.lat;
        const lngDiff = coin.position.lng - position.lng;

        // Very rough conversion (meters to pixels at this zoom)
        const scale = 1.5; // Adjust based on range
        const x = mapRect.width / 2 + (lngDiff * 111320 * Math.cos(position.lat * Math.PI / 180) * scale);
        const y = mapRect.height / 2 - (latDiff * 111320 * scale);

        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;

        map.appendChild(marker);
        markersRef.current.push(marker);
      }
    });

    // Add animations
    if (!document.getElementById('coin-styles')) {
      const style = document.createElement('style');
      style.id = 'coin-styles';
      style.textContent = `
        @keyframes coinFloat {
          0%, 100% { transform: translateX(-50%) translateY(-100%); }
          50% { transform: translateX(-50%) translateY(-110%); }
        }
        @keyframes coinCollect {
          0% { transform: translateX(-50%) translateY(-100%) scale(1); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-150%) scale(2); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [isMapReady, coins, position, attemptCollectCoin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Loading your location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">📍 Location Error</p>
          <p className="text-gray-400">{error}</p>
          <p className="text-gray-500 text-sm mt-4">Please enable location services to use this app</p>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Waiting for location...</p>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <gmp-map-3d
        ref={mapRef}
        mode="hybrid"
        center={`${position.lat}, ${position.lng}`}
        range="500"
        tilt="67"
        heading="0"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      />

      <TopBar />
      <BottomNav />

      {/* User Location Indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div className="relative">
          <div className="bg-blue-500 rounded-full w-6 h-6 border-4 border-white shadow-2xl"></div>
          <div className="absolute inset-0 bg-blue-400 rounded-full w-6 h-6 animate-ping opacity-60"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-24 right-4 z-20 flex flex-col gap-3">
        <button
          onClick={() => {
            const map = mapRef.current as any;
            if (map) {
              map.tilt = map.tilt >= 60 ? 0 : 67;
            }
          }}
          className="bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-black/80 transition-all active:scale-95"
        >
          3D View
        </button>
        <button
          onClick={() => {
            const map = mapRef.current as any;
            if (map && position) {
              map.center = `${position.lat}, ${position.lng}`;
              map.range = 500;
            }
          }}
          className="bg-black/70 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-black/80 transition-all active:scale-95"
        >
          <span className="text-2xl">📍</span>
        </button>
      </div>

      {/* Coin Counter */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 bg-primary-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-xl">
        <span className="text-lg font-bold">🪙 {coins.length} coins nearby</span>
      </div>
    </div>
  );
}
