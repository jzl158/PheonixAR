import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useCoins } from '../../hooks/useCoins';
import { useSpecialCoins } from '../../hooks/useSpecialCoins';
import { useGameStore } from '../../store/gameStore';
import { getAllHomebases } from '../../data/homebases';
import { getAllGiftCards } from '../../data/giftCards';
import { getAllARExperiences } from '../../data/arExperiences';
import { getAllTerminusDAOStops } from '../../data/terminusDAO';
import { getAllGrillz, getAllLPWChicken } from '../../data/atlantaGems';
import { TopBar } from '../navigation/TopBar';
import { ExpandableMenu } from '../navigation/ExpandableMenu';
import { ProfilePage } from '../profile/ProfilePage';
import { PhoenixOffersCards } from '../offers/PhoenixOffersCards';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { Leaderboard } from '../leaderboard/Leaderboard';

// Declare Google Maps, 3D Maps, and 8th Wall types
declare global {
  interface Window {
    google: any;
    XR8?: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': any;
    }
  }
}

export function MapView() {
  const { position, isLoading, error } = useGeolocation();
  const { coins, attemptCollectCoin } = useCoins(position);
  const { phoenixCoins, novaCoins, attemptCollectPhoenixCoin, attemptCollectNovaCoin } = useSpecialCoins(position);
  const { homebases, setHomebases } = useGameStore();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [arLoaded, setArLoaded] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // UI Panel State
  type ActivePanel = 'none' | 'profile' | 'offers' | 'leaderboard' | 'notifications' | 'friends' | 'chat';
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');

  // Load 8th Wall AR script
  useEffect(() => {
    const appKey = import.meta.env.VITE_EIGHTH_WALL_APP_KEY;
    if (!appKey) {
      console.warn('8th Wall App Key not configured. Set VITE_EIGHTH_WALL_APP_KEY in .env');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://apps.8thwall.com/xrweb?appKey=${appKey}`;
    script.async = true;
    script.onload = () => {
      console.log('✅ 8th Wall AR SDK loaded');
      setArLoaded(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load 8th Wall AR SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Start AR experience
  const startAR = async () => {
    if (!window.XR8) {
      alert('AR SDK not loaded yet. Please wait a moment and try again.');
      return;
    }

    try {
      await window.XR8.start();
      console.log('🎥 AR Camera Started');
    } catch (e) {
      console.error('❌ Failed to start AR:', e);
      alert('Failed to start AR. Please ensure camera permissions are granted.');
    }
  };

  // State for all location types
  const [giftCards, _setGiftCards] = useState(getAllGiftCards());
  const [arExperiences, _setARExperiences] = useState(getAllARExperiences());
  const [terminusStops, _setTerminusStops] = useState(getAllTerminusDAOStops());
  const [grillz, _setGrillz] = useState(getAllGrillz());
  const [lpwChicken, _setLPWChicken] = useState(getAllLPWChicken());

  // Load homebases on mount
  useEffect(() => {
    const loadedHomebases = getAllHomebases();
    setHomebases(loadedHomebases);
    console.log('🏠 Loaded', loadedHomebases.length, 'homebases');
    console.log('🎁 Loaded', giftCards.length, 'gift cards');
    console.log('📱 Loaded', arExperiences.length, 'AR experiences');
    console.log('🚉 Loaded', terminusStops.length, 'Terminus DAO stops');
    console.log('✨ Loaded', grillz.length, 'Grillz locations');
    console.log('🍗 Loaded', lpwChicken.length, 'LPW Chicken locations');
  }, [setHomebases]);

  // Wait for Google Maps 3D to load
  useEffect(() => {
    const checkMapsLoaded = setInterval(() => {
      // Check if both the API and the gmp-map-3d custom element are defined
      if (window.google && window.google.maps && customElements.get('gmp-map-3d')) {
        console.log('✅ Google Maps 3D API ready!');
        console.log('✅ gmp-map-3d custom element registered');
        setMapsLoaded(true);
        clearInterval(checkMapsLoaded);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkMapsLoaded);
      if (!window.google) {
        console.error('⏱️ Timeout: Google Maps API failed to load');
      } else if (!customElements.get('gmp-map-3d')) {
        console.error('⏱️ Timeout: gmp-map-3d custom element not registered');
        console.error('Check that libraries=maps3d is in the script URL');
      }
    }, 15000);

    return () => {
      clearInterval(checkMapsLoaded);
      clearTimeout(timeout);
    };
  }, []);

  // Initialize 3D map when API loads and position is available
  useEffect(() => {
    if (!mapRef.current || !position || !mapsLoaded) return;

    // Prevent double initialization
    if (map) return;

    console.log('🗺️ Initializing Google 3D Map...');
    console.log('📍 Position:', position);

    const map3d = mapRef.current as any;

    // Wait for the element to be fully ready
    const initMap = () => {
      try {
        // Set 3D map attributes
        map3d.center = `${position.lat}, ${position.lng}`;
        map3d.range = '2000';
        map3d.tilt = '75';
        map3d.heading = '0';
        map3d.defaultLabelsDisabled = false;

        console.log('✅ 3D Map attributes set');

        // Listen for map load event to get innerMap for markers
        const handleLoad = () => {
          console.log('✅ 3D Map loaded event fired');
          if (map3d.innerMap) {
            console.log('✅ InnerMap available');
            setMap(map3d.innerMap);
          } else {
            console.warn('⚠️ InnerMap not available yet, retrying...');
            setTimeout(() => {
              if (map3d.innerMap) {
                setMap(map3d.innerMap);
              }
            }, 1000);
          }
        };

        map3d.addEventListener('gmp-load', handleLoad);

        // Fallback: Try to get innerMap after a delay if event doesn't fire
        setTimeout(() => {
          if (!map && map3d.innerMap) {
            console.log('✅ InnerMap available via fallback');
            setMap(map3d.innerMap);
          }
        }, 2000);
      } catch (error) {
        console.error('❌ Error initializing 3D map:', error);
      }
    };

    // Give the element time to be ready
    if (map3d.tagName === 'GMP-MAP-3D') {
      initMap();
    } else {
      setTimeout(initMap, 500);
    }
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
      // Special handling for 1 coins with image overlay
      if (coin.value === 1) {
        // Create base marker with pulsating aura
        const auraIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <style>
                  @keyframes pulse1 {
                    0%, 100% { r: 35; opacity: 0.6; }
                    50% { r: 45; opacity: 0.2; }
                  }
                  @keyframes pulse2 {
                    0%, 100% { r: 40; opacity: 0.4; }
                    50% { r: 50; opacity: 0.1; }
                  }
                  .aura1 { animation: pulse1 2s ease-in-out infinite; }
                  .aura2 { animation: pulse2 2s ease-in-out infinite 0.5s; }
                </style>
              </defs>
              <circle class="aura2" cx="50" cy="50" r="40" fill="#fbbf24" opacity="0.4"/>
              <circle class="aura1" cx="50" cy="50" r="35" fill="#fbbf24" opacity="0.6"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(100, 100),
          anchor: new google.maps.Point(50, 50),
        };

        const auraMarker = new google.maps.Marker({
          position: { lat: coin.position.lat, lng: coin.position.lng },
          map: map,
          icon: auraIcon,
          title: `Coin worth ${coin.value}`,
          zIndex: 100,
        });

        // Create overlay marker with 1coin image on top
        const imageMarker = new google.maps.Marker({
          position: { lat: coin.position.lat, lng: coin.position.lng },
          map: map,
          icon: {
            url: '/1coin.png',
            scaledSize: new google.maps.Size(60, 60),
            anchor: new google.maps.Point(30, 30),
          },
          title: `Coin worth ${coin.value}`,
          zIndex: 101,
        });

        // Add click listener to both markers
        const clickHandler = async () => {
          console.log('💰 Coin clicked:', coin.value);
          const success = await attemptCollectCoin(coin);
          if (success) {
            auraMarker.setMap(null);
            imageMarker.setMap(null);
          }
        };

        auraMarker.addListener('click', clickHandler);
        imageMarker.addListener('click', clickHandler);

        markers.push(auraMarker, imageMarker);
        return; // Skip the normal marker creation
      }

      // Standard coins with pulsating aura
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad${coin.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
              </linearGradient>
              <style>
                @keyframes pulse${coin.id} {
                  0%, 100% { r: 35; opacity: 0.6; }
                  50% { r: 45; opacity: 0.2; }
                }
                @keyframes pulse2${coin.id} {
                  0%, 100% { r: 40; opacity: 0.4; }
                  50% { r: 50; opacity: 0.1; }
                }
                .aura1${coin.id} { animation: pulse${coin.id} 2s ease-in-out infinite; }
                .aura2${coin.id} { animation: pulse2${coin.id} 2s ease-in-out infinite 0.5s; }
              </style>
            </defs>
            <!-- Pulsating auras -->
            <circle class="aura2${coin.id}" cx="50" cy="40" r="40" fill="#fbbf24" opacity="0.4"/>
            <circle class="aura1${coin.id}" cx="50" cy="40" r="35" fill="#fbbf24" opacity="0.6"/>
            <!-- Main coin -->
            <circle cx="50" cy="40" r="25" fill="url(#grad${coin.id})" stroke="#d97706" stroke-width="3"/>
            <text x="50" y="48" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${coin.value}</text>
            <!-- Pointer -->
            <polygon points="50,75 42,80 58,80" fill="#d97706"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 90),
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

  // Render Phoenix Coins (RARE) as map markers
  useEffect(() => {
    if (!map || !phoenixCoins.length) return;

    console.log('🔥 Rendering', phoenixCoins.length, 'Phoenix Coins (rare)');

    const markers: google.maps.Marker[] = [];

    phoenixCoins.forEach((coin) => {
      // Create Phoenix Coin marker with fire theme
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="phoenixGrad${coin.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#f97316;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1" />
              </linearGradient>
              <style>
                @keyframes phoenixPulse${coin.id} {
                  0%, 100% { r: 35; opacity: 0.8; }
                  50% { r: 48; opacity: 0.3; }
                }
                @keyframes phoenixFlame${coin.id} {
                  0%, 100% { r: 40; opacity: 0.5; }
                  50% { r: 52; opacity: 0.15; }
                }
                .phoenixAura1${coin.id} { animation: phoenixPulse${coin.id} 1.5s ease-in-out infinite; }
                .phoenixAura2${coin.id} { animation: phoenixFlame${coin.id} 1.5s ease-in-out infinite 0.3s; }
              </style>
            </defs>
            <!-- Intense pulsating fire auras -->
            <circle class="phoenixAura2${coin.id}" cx="50" cy="40" r="40" fill="#f97316" opacity="0.5"/>
            <circle class="phoenixAura1${coin.id}" cx="50" cy="40" r="35" fill="#ef4444" opacity="0.8"/>
            <!-- Main Phoenix Coin with gradient -->
            <circle cx="50" cy="40" r="28" fill="url(#phoenixGrad${coin.id})" stroke="#dc2626" stroke-width="4"/>
            <!-- Phoenix symbol (stylized bird) -->
            <path d="M 50 30 L 45 35 L 42 40 L 45 45 L 50 50 L 55 45 L 58 40 L 55 35 Z" fill="#fef3c7" stroke="#dc2626" stroke-width="1.5"/>
            <text x="50" y="62" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">RARE</text>
            <!-- Pointer -->
            <polygon points="50,75 42,80 58,80" fill="#dc2626"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 90),
      };

      const marker = new google.maps.Marker({
        position: { lat: coin.position.lat, lng: coin.position.lng },
        map: map,
        icon: iconConfig,
        title: 'Phoenix Coin (RARE)',
        zIndex: 500,
      });

      marker.addListener('click', async () => {
        console.log('🔥 Phoenix Coin clicked');
        const success = await attemptCollectPhoenixCoin(coin);
        if (success) {
          marker.setMap(null);
        }
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, phoenixCoins, attemptCollectPhoenixCoin]);

  // Render Nova Coins (SEMI-RARE) as map markers
  useEffect(() => {
    if (!map || !novaCoins.length) return;

    console.log('⭐ Rendering', novaCoins.length, 'Nova Coins (semi-rare)');

    const markers: google.maps.Marker[] = [];

    novaCoins.forEach((coin) => {
      // Create Nova Coin marker with star/cosmic theme
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="novaGrad${coin.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#6366f1;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
              </linearGradient>
              <style>
                @keyframes novaPulse${coin.id} {
                  0%, 100% { r: 35; opacity: 0.7; }
                  50% { r: 45; opacity: 0.25; }
                }
                @keyframes novaGlow${coin.id} {
                  0%, 100% { r: 40; opacity: 0.45; }
                  50% { r: 50; opacity: 0.12; }
                }
                .novaAura1${coin.id} { animation: novaPulse${coin.id} 2s ease-in-out infinite; }
                .novaAura2${coin.id} { animation: novaGlow${coin.id} 2s ease-in-out infinite 0.5s; }
              </style>
            </defs>
            <!-- Cosmic pulsating auras -->
            <circle class="novaAura2${coin.id}" cx="50" cy="40" r="40" fill="#6366f1" opacity="0.45"/>
            <circle class="novaAura1${coin.id}" cx="50" cy="40" r="35" fill="#8b5cf6" opacity="0.7"/>
            <!-- Main Nova Coin -->
            <circle cx="50" cy="40" r="27" fill="url(#novaGrad${coin.id})" stroke="#4f46e5" stroke-width="3.5"/>
            <!-- Star symbol -->
            <polygon points="50,28 52,35 59,35 53,40 55,47 50,42 45,47 47,40 41,35 48,35" fill="#e0e7ff" stroke="#4f46e5" stroke-width="1"/>
            <text x="50" y="62" font-size="10" font-weight="bold" fill="#4f46e5" text-anchor="middle">100 pts</text>
            <!-- Pointer -->
            <polygon points="50,75 42,80 58,80" fill="#4f46e5"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 90),
      };

      const marker = new google.maps.Marker({
        position: { lat: coin.position.lat, lng: coin.position.lng },
        map: map,
        icon: iconConfig,
        title: 'Nova Coin (100 pts)',
        zIndex: 450,
      });

      marker.addListener('click', async () => {
        console.log('⭐ Nova Coin clicked');
        const success = await attemptCollectNovaCoin(coin);
        if (success) {
          marker.setMap(null);
        }
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, novaCoins, attemptCollectNovaCoin]);

  // Render Gift Cards as map markers
  useEffect(() => {
    if (!map || !giftCards.length) return;

    console.log('🎁 Rendering', giftCards.length, 'Gift Card locations');

    const markers: google.maps.Marker[] = [];

    giftCards.forEach((giftCard) => {
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="80" height="90" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="giftGrad${giftCard.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Gift box -->
            <rect x="20" y="35" width="40" height="35" fill="url(#giftGrad${giftCard.id})" stroke="#be123c" stroke-width="2"/>
            <!-- Ribbon vertical -->
            <rect x="36" y="35" width="8" height="35" fill="#fecdd3"/>
            <!-- Ribbon horizontal -->
            <rect x="20" y="48" width="40" height="8" fill="#fecdd3"/>
            <!-- Bow -->
            <circle cx="33" cy="30" r="5" fill="#fecdd3"/>
            <circle cx="47" cy="30" r="5" fill="#fecdd3"/>
            <circle cx="40" cy="28" r="4" fill="#ec4899"/>
            <!-- Dollar sign -->
            <text x="40" y="60" font-size="14" font-weight="bold" fill="white" text-anchor="middle">$</text>
            <!-- Pointer -->
            <polygon points="40,75 32,80 48,80" fill="#be123c"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(80, 90),
        anchor: new google.maps.Point(40, 90),
      };

      const marker = new google.maps.Marker({
        position: { lat: giftCard.position.lat, lng: giftCard.position.lng },
        map: map,
        icon: iconConfig,
        title: giftCard.title,
        zIndex: 400,
      });

      marker.addListener('click', () => {
        alert(`🎁 ${giftCard.title}\n\n${giftCard.description}\n\nValue: $${giftCard.value}\nMerchant: ${giftCard.merchantName}\n\nGet within ${giftCard.proximityRequired} feet to claim!`);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, giftCards]);

  // Render AR Experiences as map markers
  useEffect(() => {
    if (!map || !arExperiences.length) return;

    console.log('📱 Rendering', arExperiences.length, 'AR Experience locations');

    const markers: google.maps.Marker[] = [];

    arExperiences.forEach((arExp) => {
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="80" height="90" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="arGrad${arExp.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0891b2;stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Camera body -->
            <rect x="15" y="35" width="50" height="35" rx="5" fill="url(#arGrad${arExp.id})" stroke="#0e7490" stroke-width="2"/>
            <!-- Lens -->
            <circle cx="35" cy="52" r="12" fill="#67e8f9" stroke="#0e7490" stroke-width="2"/>
            <circle cx="35" cy="52" r="8" fill="#22d3ee" stroke="#0e7490" stroke-width="1"/>
            <!-- AR sparkles -->
            <circle cx="55" cy="42" r="3" fill="#fbbf24"/>
            <circle cx="58" cy="50" r="2" fill="#fbbf24"/>
            <circle cx="56" cy="58" r="2.5" fill="#fbbf24"/>
            <!-- AR text -->
            <text x="40" y="31" font-size="10" font-weight="bold" fill="#0e7490" text-anchor="middle">AR</text>
            <!-- Pointer -->
            <polygon points="40,75 32,80 48,80" fill="#0e7490"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(80, 90),
        anchor: new google.maps.Point(40, 90),
      };

      const marker = new google.maps.Marker({
        position: { lat: arExp.position.lat, lng: arExp.position.lng },
        map: map,
        icon: iconConfig,
        title: arExp.title,
        zIndex: 380,
      });

      marker.addListener('click', () => {
        alert(`📱 ${arExp.title}\n\n${arExp.description}\n\nGet within ${arExp.proximityRequired} feet to activate!`);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, arExperiences]);

  // Render Terminus DAO Stops as map markers
  useEffect(() => {
    if (!map || !terminusStops.length) return;

    console.log('🚉 Rendering', terminusStops.length, 'Terminus DAO stops');

    const markers: google.maps.Marker[] = [];

    terminusStops.forEach((stop) => {
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="80" height="90" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="terminusGrad${stop.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Transit stop sign -->
            <rect x="20" y="30" width="40" height="40" rx="3" fill="url(#terminusGrad${stop.id})" stroke="#5b21b6" stroke-width="2.5"/>
            <!-- DAO symbol -->
            <circle cx="40" cy="45" r="10" fill="none" stroke="white" stroke-width="2.5"/>
            <circle cx="40" cy="45" r="5" fill="white"/>
            <line x1="35" y1="55" x2="45" y2="55" stroke="white" stroke-width="2.5"/>
            <!-- Pointer -->
            <polygon points="40,75 32,80 48,80" fill="#5b21b6"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(80, 90),
        anchor: new google.maps.Point(40, 90),
      };

      const marker = new google.maps.Marker({
        position: { lat: stop.position.lat, lng: stop.position.lng },
        map: map,
        icon: iconConfig,
        title: stop.name,
        zIndex: 360,
      });

      marker.addListener('click', () => {
        alert(`🚉 ${stop.name}\n\n${stop.description}\n\nBadges: ${stop.badges?.join(', ') || 'Various'}\n\nGet within ${stop.proximityRequired} feet to participate!`);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, terminusStops]);

  // Render Grillz locations as map markers
  useEffect(() => {
    if (!map || !grillz.length) return;

    console.log('✨ Rendering', grillz.length, 'Grillz locations');

    const markers: google.maps.Marker[] = [];

    grillz.forEach((grillzLoc) => {
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="80" height="90" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grillzGrad${grillzLoc.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Grillz/teeth background -->
            <rect x="18" y="38" width="44" height="25" rx="12" fill="url(#grillzGrad${grillzLoc.id})" stroke="#d97706" stroke-width="2.5"/>
            <!-- Diamond sparkles -->
            <polygon points="30,48 32,45 34,48 32,51" fill="white"/>
            <polygon points="40,48 42,45 44,48 42,51" fill="white"/>
            <polygon points="50,48 52,45 54,48 52,51" fill="white"/>
            <circle cx="28" cy="42" r="1.5" fill="white"/>
            <circle cx="40" cy="42" r="1.5" fill="white"/>
            <circle cx="52" cy="42" r="1.5" fill="white"/>
            <!-- ATL text -->
            <text x="40" y="31" font-size="9" font-weight="bold" fill="#d97706" text-anchor="middle">ATL</text>
            <!-- Pointer -->
            <polygon points="40,70 32,75 48,75" fill="#d97706"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(80, 90),
        anchor: new google.maps.Point(40, 90),
      };

      const marker = new google.maps.Marker({
        position: { lat: grillzLoc.position.lat, lng: grillzLoc.position.lng },
        map: map,
        icon: iconConfig,
        title: grillzLoc.name,
        zIndex: 340,
      });

      marker.addListener('click', () => {
        alert(`✨ ${grillzLoc.name}\n\n${grillzLoc.description}\n\nGet within ${grillzLoc.proximityRequired} feet to claim!`);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, grillz]);

  // Render LPW Chicken locations as map markers
  useEffect(() => {
    if (!map || !lpwChicken.length) return;

    console.log('🍗 Rendering', lpwChicken.length, 'LPW Chicken locations');

    const markers: google.maps.Marker[] = [];

    lpwChicken.forEach((lpw) => {
      const iconConfig = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="80" height="90" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lpwGrad${lpw.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
              </linearGradient>
            </defs>
            <!-- Chicken wing shape -->
            <ellipse cx="35" cy="48" rx="18" ry="14" fill="url(#lpwGrad${lpw.id})" stroke="#c2410c" stroke-width="2"/>
            <ellipse cx="48" cy="50" rx="12" ry="10" fill="url(#lpwGrad${lpw.id})" stroke="#c2410c" stroke-width="2"/>
            <!-- Lemon slices -->
            <circle cx="28" cy="42" r="5" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
            <circle cx="52" cy="46" r="4" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
            <!-- LPW text -->
            <text x="40" y="31" font-size="9" font-weight="bold" fill="#c2410c" text-anchor="middle">LPW</text>
            <text x="40" y="67" font-size="8" font-weight="bold" fill="#c2410c" text-anchor="middle">ATL</text>
            <!-- Pointer -->
            <polygon points="40,73 32,78 48,78" fill="#c2410c"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(80, 90),
        anchor: new google.maps.Point(40, 90),
      };

      const marker = new google.maps.Marker({
        position: { lat: lpw.position.lat, lng: lpw.position.lng },
        map: map,
        icon: iconConfig,
        title: lpw.name,
        zIndex: 320,
      });

      marker.addListener('click', () => {
        alert(`🍗 ${lpw.name}\n\n${lpw.description}\n\nGet within ${lpw.proximityRequired} feet to find that Lemon Pepper Wet!`);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, lpwChicken]);

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
      {/* Google 3D Maps Container */}
      <gmp-map-3d
        ref={mapRef}
        center={position ? `${position.lat}, ${position.lng}` : '33.8541508, -84.381267'}
        range="2000"
        tilt="75"
        heading="0"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />

      <TopBar
        onNotificationClick={() => setActivePanel('notifications')}
        onProfileClick={() => setActivePanel('profile')}
      />

      {/* Expandable Menu Bar */}
      <ExpandableMenu
        onPinClick={() => {
          // Recenter 3D map on user location
          if (mapRef.current && position) {
            const map3d = mapRef.current as any;
            map3d.center = `${position.lat}, ${position.lng}`;
          }
        }}
        onPhoenixClick={() => setActivePanel('offers')}
        onLeaderboardClick={() => setActivePanel('leaderboard')}
        onFriendsClick={() => setActivePanel('friends')}
        onChatClick={() => setActivePanel('chat')}
      />

      {/* Controls */}
      <div className="absolute top-24 right-4 z-20 flex flex-col gap-3">
        <button
          onClick={startAR}
          disabled={!arLoaded}
          className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all active:scale-95 ${
            arLoaded
              ? 'bg-primary-600/90 backdrop-blur-md text-white hover:bg-primary-700/90'
              : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
          }`}
          title={arLoaded ? 'Launch AR Experience' : 'Loading AR SDK...'}
        >
          {arLoaded ? '📱 Open AR' : '⏳ Loading AR...'}
        </button>

        <button
          onClick={() => setDebugMode(!debugMode)}
          className="bg-black/70 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-black/80 transition-all active:scale-95"
          title="Toggle Debug Mode"
        >
          <span className="text-xl">{debugMode ? '🔧' : '⚙️'}</span>
        </button>

        {debugMode && (
          <button
            onClick={() => {
              if (mapRef.current) {
                const map3d = mapRef.current as any;
                const currentTilt = parseInt(map3d.tilt || '75');
                if (currentTilt > 45) {
                  // Low tilt (more top-down)
                  map3d.tilt = '15';
                  map3d.range = '1000';
                } else {
                  // High tilt (more perspective)
                  map3d.tilt = '75';
                  map3d.range = '2000';
                }
              }
            }}
            className="bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-black/80 transition-all active:scale-95"
          >
            {(() => {
              const currentTilt = parseInt((mapRef.current as any)?.tilt || '75');
              return currentTilt > 45 ? '🗺️ Top View' : '🏙️ 3D View';
            })()}
          </button>
        )}
      </div>

      {/* Coin Counter */}
      <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 bg-primary-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-xl pointer-events-none">
        <span className="text-lg font-bold">🪙 {coins.length} coins nearby</span>
      </div>

      {/* Debug info - only visible in debug mode */}
      {debugMode && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white text-xs p-3 rounded-lg backdrop-blur-sm max-w-xs">
          <div className="font-bold mb-1">Debug Info (3D Map):</div>
          <div>Lat: {position.lat.toFixed(6)}</div>
          <div>Lng: {position.lng.toFixed(6)}</div>
          <div>Coins: {coins.length}</div>
          <div>Maps 3D: {mapsLoaded ? '✓' : '✗'}</div>
          <div>Mode: {(mapRef.current as any)?.mode || 'hybrid'}</div>
          <div>Tilt: {(mapRef.current as any)?.tilt || '75'}°</div>
          <div>Heading: {(mapRef.current as any)?.heading || '0'}°</div>
          <div>Range: {(mapRef.current as any)?.range || '2000'}m</div>
          <div>Center: {(mapRef.current as any)?.center || 'loading'}</div>
        </div>
      )}

      {/* UI Panels */}
      {activePanel === 'profile' && <ProfilePage onClose={() => setActivePanel('none')} />}
      {activePanel === 'offers' && <PhoenixOffersCards onClose={() => setActivePanel('none')} />}
      {activePanel === 'leaderboard' && <Leaderboard onClose={() => setActivePanel('none')} />}
      {activePanel === 'notifications' && <NotificationPanel onClose={() => setActivePanel('none')} />}
      {activePanel === 'friends' && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-white text-2xl font-bold mb-4">Friends</h2>
            <p className="text-gray-400 mb-6">Friends and social features coming soon!</p>
            <button
              onClick={() => setActivePanel('none')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {activePanel === 'chat' && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-white text-2xl font-bold mb-4">Chat</h2>
            <p className="text-gray-400 mb-6">Chat features coming soon!</p>
            <button
              onClick={() => setActivePanel('none')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
