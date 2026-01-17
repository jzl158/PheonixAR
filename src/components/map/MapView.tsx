import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCoins } from '../../hooks/useCoins';
import { useGameStore } from '../../store/gameStore';
import { getAllHomebases } from '../../data/homebases';
import { TopBar } from '../navigation/TopBar';
import { BottomNav } from '../navigation/BottomNav';

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

export function MapView() {
  const { position, isLoading, error } = useGeolocation();
  const { coins, attemptCollectCoin } = useCoins(position);
  const { homebases, setHomebases } = useGameStore();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Load homebases on mount
  useEffect(() => {
    const loadedHomebases = getAllHomebases();
    setHomebases(loadedHomebases);
    console.log('🏠 Loaded', loadedHomebases.length, 'homebases');
  }, [setHomebases]);

  // Wait for Google Maps to load
  useEffect(() => {
    const checkMapsLoaded = setInterval(() => {
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps API ready!');
        setMapsLoaded(true);
        clearInterval(checkMapsLoaded);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkMapsLoaded);
      console.error('⏱️ Timeout waiting for Google Maps');
    }, 10000);

    return () => {
      clearInterval(checkMapsLoaded);
      clearTimeout(timeout);
    };
  }, []);

  // Initialize map when API loads and position is available
  useEffect(() => {
    if (!mapRef.current || !position || !mapsLoaded || map) return;

    console.log('🗺️ Initializing Google Maps...');
    console.log('📍 Position:', position);

    const newMap = new google.maps.Map(mapRef.current, {
      center: { lat: position.lat, lng: position.lng },
      zoom: 18,
      tilt: 67.5,
      heading: 0,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      clickableIcons: false,
    });

    console.log('✅ Map initialized!');
    setMap(newMap);
  }, [mapsLoaded, position, map]);

  // Add user location marker
  useEffect(() => {
    if (!map || !position) return;

    console.log('📍 Adding user location marker at:', position);

    // Create user location marker
    const userMarker = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
      title: 'Your Location',
      zIndex: 1000,
    });

    console.log('✅ User location marker added');

    // Cleanup
    return () => {
      userMarker.setMap(null);
    };
  }, [map, position]);

  // Render coins as Google Maps markers
  useEffect(() => {
    if (!map || !coins.length) return;

    console.log('🪙 Rendering', coins.length, 'coins as map markers');

    const markers: google.maps.Marker[] = [];

    coins.forEach((coin) => {
      // Use custom 1coin.png image for value 1 coins
      const iconConfig = coin.value === 1 ? {
        url: '/1coin.png',
        scaledSize: new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 60),
      } : {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="60" height="70" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad${coin.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="30" cy="30" r="25" fill="url(#grad${coin.id})" stroke="#d97706" stroke-width="3"/>
            <text x="30" y="38" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${coin.value}</text>
            <polygon points="30,55 22,60 38,60" fill="#d97706"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(60, 70),
        anchor: new google.maps.Point(30, 70),
      };

      // Create marker
      const marker = new google.maps.Marker({
        position: { lat: coin.position.lat, lng: coin.position.lng },
        map: map,
        icon: iconConfig,
        title: `Coin worth ${coin.value}`,
      });

      // Add click listener
      marker.addListener('click', async () => {
        console.log('💰 Coin clicked:', coin.value);
        const success = await attemptCollectCoin(coin);
        if (success) {
          // Show success animation before removing
          const pos = marker.getPosition();
          if (pos) {
            // Create a temporary animation overlay
            const successDiv = document.createElement('div');
            successDiv.style.cssText = `
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              font-size: 48px;
              animation: collectSuccess 1s ease-out forwards;
              pointer-events: none;
              z-index: 10000;
            `;
            successDiv.textContent = `+${coin.value}`;
            document.body.appendChild(successDiv);

            setTimeout(() => successDiv.remove(), 1000);
          }

          marker.setMap(null);
        }
      });

      // Add success animation CSS if not already added
      if (!document.getElementById('collect-success-animation')) {
        const style = document.createElement('style');
        style.id = 'collect-success-animation';
        style.textContent = `
          @keyframes collectSuccess {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 1;
              color: #fbbf24;
            }
            50% {
              transform: translate(-50%, -100px) scale(1.5);
              opacity: 1;
              color: #10b981;
            }
            100% {
              transform: translate(-50%, -150px) scale(2);
              opacity: 0;
              color: #10b981;
            }
          }
        `;
        document.head.appendChild(style);
      }

      markers.push(marker);
    });

    // Add CSS animations if not already added
    if (!document.getElementById('coin-animations')) {
      const style = document.createElement('style');
      style.id = 'coin-animations';
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes collect {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2) translateY(-50px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function to remove markers
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, coins, attemptCollectCoin]);

  // Render homebases as map markers
  useEffect(() => {
    if (!map || !homebases.length) return;

    console.log('🏠 Rendering', homebases.length, 'homebase markers');

    const markers: google.maps.Marker[] = [];

    homebases.forEach((homebase) => {
      // Create homebase marker with house icon
      const marker = new google.maps.Marker({
        position: { lat: homebase.position.lat, lng: homebase.position.lng },
        map: map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="70" height="80" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                </linearGradient>
              </defs>
              <!-- House base -->
              <rect x="20" y="35" width="30" height="30" fill="url(#homeGrad)" stroke="#047857" stroke-width="2"/>
              <!-- Roof -->
              <polygon points="35,20 15,35 55,35" fill="#047857"/>
              <!-- Door -->
              <rect x="30" y="48" width="10" height="17" fill="#065f46"/>
              <!-- Window -->
              <rect x="25" y="40" width="6" height="6" fill="#d1fae5"/>
              <rect x="39" y="40" width="6" height="6" fill="#d1fae5"/>
              <!-- Pointer -->
              <polygon points="35,70 27,75 43,75" fill="#047857"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(70, 80),
          anchor: new google.maps.Point(35, 80),
        },
        title: homebase.name,
        zIndex: 999, // Higher than coins
      });

      // Add click listener
      marker.addListener('click', () => {
        console.log('🏠 Homebase clicked:', homebase.name);
        // Show info about the homebase
        alert(`🏠 ${homebase.name}\n\n${homebase.description || ''}\n\nAddress: ${homebase.address}\nPlus Code: ${homebase.plusCode}`);
      });

      markers.push(marker);
    });

    // Cleanup function to remove markers
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, homebases]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📍</div>
          <p className="text-white text-lg">Loading your location...</p>
          <p className="text-gray-500 text-sm mt-2">Please allow location access</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-red-500 text-3xl mb-4">📍</p>
          <p className="text-red-400 text-xl mb-4">Location Error</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-6">
            Please enable location services in your browser settings and reload the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-bold transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📍</div>
          <p className="text-white text-lg">Waiting for location...</p>
        </div>
      </div>
    );
  }

  if (!mapsLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-4 animate-spin">🗺️</div>
          <p className="text-white text-lg mb-4">Loading Google Maps 3D...</p>
          <p className="text-gray-500 text-sm">
            This may take a few moments. Check the browser console (F12) for details.
          </p>
          <div className="mt-6 text-xs text-gray-600">
            <p>Waiting for:</p>
            <p>• Google Maps API to load</p>
            <p>• 3D map component to initialize</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#1a1a1a' }}>
      {/* Google Maps Container */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      <TopBar />
      <BottomNav />

      {/* Controls */}
      <div className="absolute top-24 right-4 z-20 flex flex-col gap-3">
        <button
          onClick={() => {
            if (map) {
              const currentTilt = map.getTilt();
              map.setTilt(currentTilt === 0 ? 67.5 : 0);
            }
          }}
          className="bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-black/80 transition-all active:scale-95"
        >
          3D View
        </button>
        <button
          onClick={() => {
            if (map && position) {
              map.setCenter({ lat: position.lat, lng: position.lng });
              map.setZoom(18);
            }
          }}
          className="bg-black/70 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-black/80 transition-all active:scale-95"
        >
          <span className="text-2xl">📍</span>
        </button>
      </div>

      {/* Coin Counter */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 bg-primary-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-xl pointer-events-none">
        <span className="text-lg font-bold">🪙 {coins.length} coins nearby</span>
      </div>

      {/* Debug info */}
      <div className="absolute top-4 left-4 z-50 bg-black/80 text-white text-xs p-3 rounded-lg backdrop-blur-sm">
        <div className="font-bold mb-1">Debug Info:</div>
        <div>Lat: {position.lat.toFixed(6)}</div>
        <div>Lng: {position.lng.toFixed(6)}</div>
        <div>Coins: {coins.length}</div>
        <div>Maps: {mapsLoaded ? '✓' : '✗'}</div>
      </div>
    </div>
  );
}
