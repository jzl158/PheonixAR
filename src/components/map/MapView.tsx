import { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
// import { useCoins } from '../../hooks/useCoins';
// import { useSpecialCoins } from '../../hooks/useSpecialCoins';
import { useGameStore } from '../../store/gameStore';
import { getAllHomebases } from '../../data/homebases';
import { getAllCollectibles } from '../../data/collectibles';
// import { getAllGiftCards } from '../../data/giftCards';
// import { getAllARExperiences } from '../../data/arExperiences';
// import { getAllTerminusDAOStops } from '../../data/terminusDAO';
// import { getAllGrillz, getAllLPWChicken } from '../../data/atlantaGems';
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
  const { position, isLoading, error, accuracy } = useGeolocation();
  // const { coins, attemptCollectCoin } = useCoins(position);
  // const { phoenixCoins, novaCoins, attemptCollectPhoenixCoin, attemptCollectNovaCoin } = useSpecialCoins(position);
  const { setHomebases, collectibles, setCollectibles, collectCollectible, getCollectibleState } = useGameStore();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | any>(null);
  const [arLoaded, setArLoaded] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // UI Panel State
  type ActivePanel = 'none' | 'profile' | 'offers' | 'leaderboard' | 'notifications' | 'friends' | 'chat';
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');

  // Collection animation state
  const [collectionAnimations, setCollectionAnimations] = useState<{ id: string; value: number; x: number; y: number }[]>([]);

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

  // Initialize collectibles with user's position
  useEffect(() => {
    if (!position || collectibles.length > 0) return;

    const worldCollectibles = getAllCollectibles().map(c => ({
      ...c,
      position: { lat: position.lat, lng: position.lng }, // Place at user's location for demo
    }));

    setCollectibles(worldCollectibles);
    console.log('🎁 Initialized collectibles:', worldCollectibles);
  }, [position]);

  // State for all location types - commented out for now (using 3D objects instead)
  // const [giftCards, _setGiftCards] = useState(getAllGiftCards());
  // const [arExperiences, _setARExperiences] = useState(getAllARExperiences());
  // const [terminusStops, _setTerminusStops] = useState(getAllTerminusDAOStops());
  // const [grillz, _setGrillz] = useState(getAllGrillz());
  // const [lpwChicken, _setLPWChicken] = useState(getAllLPWChicken());

  // Load homebases on mount
  useEffect(() => {
    const loadedHomebases = getAllHomebases();
    setHomebases(loadedHomebases);
    console.log('🏠 Loaded', loadedHomebases.length, 'homebases');
    // console.log('🎁 Loaded', giftCards.length, 'gift cards');
    // console.log('📱 Loaded', arExperiences.length, 'AR experiences');
    // console.log('🚉 Loaded', terminusStops.length, 'Terminus DAO stops');
    // console.log('✨ Loaded', grillz.length, 'Grillz locations');
    // console.log('🍗 Loaded', lpwChicken.length, 'LPW Chicken locations');
  }, [setHomebases]);

  // Wait for Google Maps 3D to load
  useEffect(() => {
    const checkMapsLoaded = setInterval(() => {
      // Check if both the API and the gmp-map-3d custom element are defined
      if (window.google && window.google.maps && customElements.get('gmp-map-3d')) {
        console.log('✅ Google Maps 3D API ready!');
        console.log('✅ gmp-map-3d custom element registered');
        console.log('✅ Map3DElement:', window.google.maps.Map3DElement);
        console.log('✅ Available Maps APIs:', Object.keys(window.google.maps));

        // Check for importLibrary method
        if (window.google.maps.importLibrary) {
          console.log('✅ importLibrary available');
        }

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

  // Track if map has been initialized
  const [mapInitialized, setMapInitialized] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  // Initialize 3D map when API loads and position is available (ONCE)
  useEffect(() => {
    if (!mapRef.current || !position || !mapsLoaded || mapInitialized) return;

    console.log('═══════════════════════════════════════');
    console.log('🚀 MapView v6.0 - Improved GPS Accuracy');
    console.log('═══════════════════════════════════════');

    const map3d = mapRef.current as any;

    try {
      console.log('📍 Initializing with setAttribute (string format)...');
      console.log('Position:', position);
      console.log('GPS Accuracy:', accuracy ? `${accuracy}m` : 'unknown');

      // Store GPS accuracy
      setGpsAccuracy(accuracy);

      // CRITICAL: Use setAttribute() with STRING values to trigger proper initialization
      // The web component expects attributes as strings initially
      // mode="hybrid" is REQUIRED for satellite imagery + 3D buildings
      map3d.setAttribute('mode', 'hybrid');
      // Use lat,lng without altitude for more accurate positioning
      map3d.setAttribute('center', `${position.lat},${position.lng}`);
      // Range of 2000m provides wide overview with excellent context
      map3d.setAttribute('range', '2000');
      // Medium tilt (50°) provides bird's eye view with good 3D perspective
      map3d.setAttribute('tilt', '50');
      map3d.setAttribute('heading', '0');

      // Enable gesture controls for touch interaction
      // Don't disable default UI - it handles gestures
      map3d.style.touchAction = 'none'; // Let the map handle all touch events

      console.log('✅ Gesture controls enabled (one finger pan, two finger tilt/rotate)');

      console.log('✅ Attributes set (string format with mode=hybrid)');

      // Wait for the element to initialize, then check (increased to 2000ms for reliability)
      setTimeout(() => {
        console.log('🔍 Element diagnostics (after setAttribute):');
        console.log('- Element dimensions:', map3d.offsetWidth, 'x', map3d.offsetHeight);
        console.log('- Has shadow root:', !!map3d.shadowRoot);
        console.log('- center property:', map3d.center);
        console.log('- range property:', map3d.range);
        console.log('- tilt property:', map3d.tilt);

        if (map3d.shadowRoot) {
          console.log('✅ Shadow root created! Map should be rendering.');
          console.log('- Shadow root children:', map3d.shadowRoot.childNodes.length);
        } else {
          console.error('❌ Shadow root NOT created. Element may not have initialized.');
        }
      }, 2000);

      // Add custom 3D model at user location using local GLB file
      const add3DModel = async () => {
        try {
          console.log('🎨 Adding custom 3D model from local file...');
          console.log('🎨 User position:', position);

          // Wait for map to fully initialize
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Import Model3DInteractiveElement
          const { Model3DInteractiveElement } = await window.google.maps.importLibrary('maps3d') as any;

          // Person0 with large scale
          const modelSrc = '/person0.glb';
          console.log('🎯 Loading person0 with LARGE scale (15)');

          // Create 3D model at user's location using local GLB file
          const model = new Model3DInteractiveElement({
            src: modelSrc,
            position: { lat: position.lat, lng: position.lng, altitude: 0 },
            orientation: { heading: 0, tilt: 0, roll: 0 },
            scale: 15,
            altitudeMode: 'CLAMP_TO_GROUND',
          });

          // Debug: Listen for model load events
          model.addEventListener('gmp-load', () => {
            console.log('✅ Model LOADED successfully!');
          });

          model.addEventListener('gmp-error', (event: any) => {
            console.error('❌ Model FAILED to load:', event);
          });

          console.log('📦 Model created, waiting for load...', model);

          // Add click listener to collect 47 points and reveal windmill
          model.addEventListener('gmp-click', async () => {
            console.log('🧍 Person collected! +47 points - Unlocking hidden item...');

            // Show collection animation at center of screen
            const animId = `anim_${Date.now()}`;
            setCollectionAnimations(prev => [...prev, {
              id: animId,
              value: 47,
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            }]);

            // Remove animation after 1 second
            setTimeout(() => {
              setCollectionAnimations(prev => prev.filter(a => a.id !== animId));
            }, 1000);

            // Add 47 points to user's balance
            const { collectCoin } = useGameStore.getState();
            collectCoin('person0', 47);

            // Remove the person from the map
            if (model.parentNode) {
              model.parentNode.removeChild(model);
            }

            // Reveal windmill in the same location after a brief delay
            setTimeout(async () => {
              try {
                console.log('🎁 Revealing hidden windmill...');

                // Re-import library for windmill creation
                const { Model3DInteractiveElement: WindmillElement } = await window.google.maps.importLibrary('maps3d') as any;

                const windmill = new WindmillElement({
                  src: '/windmill.glb',
                  position: { lat: position.lat, lng: position.lng, altitude: 0 },
                  orientation: { heading: 0, tilt: 270, roll: 90 },
                  scale: 0.15,
                  altitudeMode: 'CLAMP_TO_GROUND',
                });

                // Make windmill collectible too
                windmill.addEventListener('gmp-click', () => {
                  console.log('🎨 Windmill collected! +100 points');

                  // Show collection animation
                  const windmillAnimId = `anim_${Date.now()}`;
                  setCollectionAnimations(prev => [...prev, {
                    id: windmillAnimId,
                    value: 100,
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                  }]);

                  setTimeout(() => {
                    setCollectionAnimations(prev => prev.filter(a => a.id !== windmillAnimId));
                  }, 1000);

                  const { collectCoin } = useGameStore.getState();
                  collectCoin('windmill', 100);

                  // Remove windmill
                  if (windmill.parentNode) {
                    windmill.parentNode.removeChild(windmill);
                  }
                });

                map3d.append(windmill);
                console.log('✅ Windmill revealed and appended to map!');
              } catch (error) {
                console.error('❌ Error revealing windmill:', error);
              }
            }, 500);
          });

          // Append model to map
          map3d.append(model);

          console.log('✅ Person0 3D model added at user location:', {
            position: { lat: position.lat, lng: position.lng },
            scale: 2.0,
            src: '/person0.glb'
          });
        } catch (error) {
          console.error('❌ Error adding 3D model:', error);
        }
      };

      add3DModel();

      // Set map state so UI knows map is ready
      setMap(map3d as any);
      setMapInitialized(true); // Mark as initialized so we don't reset center on position updates

      console.log('✅ 3D Map initialization attempted - will not auto-recenter');

    } catch (error) {
      console.error('❌ Error initializing 3D map:', error);
    }
  }, [mapsLoaded, position, mapInitialized, accuracy]);

  // Track user location marker refs
  const userMarkerRef = useRef<any>(null);
  const accuracyCircleRef = useRef<any>(null);
  const markerInitializedRef = useRef(false);

  // Create user location marker once when we have both map and initial position
  useEffect(() => {
    if (!map || !position || markerInitializedRef.current) return;

    // Mark as initialized so we don't recreate
    markerInitializedRef.current = true;

    // Handle 3D map markers - Use Model3DInteractiveElement (proven to work!)
    if (map.tagName === 'GMP-MAP-3D') {
      console.log('📍 Creating 3D user location marker using Model3D at:', position);

      const createLocationMarker = async () => {
        try {
          const { Model3DInteractiveElement } = await window.google.maps.importLibrary('maps3d') as any;

          // Use tiny windmill as location marker (we know Model3DInteractiveElement works!)
          const locationMarker = new Model3DInteractiveElement({
            src: '/windmill.glb',
            position: { lat: position.lat, lng: position.lng, altitude: 0 },
            orientation: { heading: 0, tilt: 0, roll: 0 },
            scale: 0.05, // Super tiny - just visible as a dot
            altitudeMode: 'CLAMP_TO_GROUND',
          });

          map.append(locationMarker);
          userMarkerRef.current = locationMarker;

          console.log('✅ 3D location marker created (Model3D windmill at 0.05 scale)');
        } catch (error) {
          console.error('❌ Failed to create location marker:', error);
        }
      };

      createLocationMarker();
    } else {
      console.log('📍 Creating 2D user location marker at:', position);

      // Create blue dot for user location (2D map)
      const userMarker = new google.maps.Marker({
        map: map,
        position: { lat: position.lat, lng: position.lng },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        title: 'Your Location',
        zIndex: 1000,
      });

      // Create accuracy circle
      const accuracyCircle = new google.maps.Circle({
        map: map,
        center: { lat: position.lat, lng: position.lng },
        radius: accuracy || 50,
        strokeColor: '#4285F4',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        zIndex: 999,
      });

      userMarkerRef.current = userMarker;
      accuracyCircleRef.current = accuracyCircle;

      console.log('✅ 2D user location marker created and will track movement');
    }

    // Cleanup
    return () => {
      if (userMarkerRef.current) {
        if (map.tagName === 'GMP-MAP-3D') {
          if (userMarkerRef.current.parentNode) {
            userMarkerRef.current.parentNode.removeChild(userMarkerRef.current);
          }
        } else {
          userMarkerRef.current.setMap(null);
          if (accuracyCircleRef.current) {
            accuracyCircleRef.current.setMap(null);
          }
        }
      }
      userMarkerRef.current = null;
      accuracyCircleRef.current = null;
      markerInitializedRef.current = false;
    };
  }, [map, position, accuracy]);

  // Update user location marker position when position changes
  useEffect(() => {
    if (!userMarkerRef.current || !position) {
      console.log('⏸️ Position update skipped:', { hasMarker: !!userMarkerRef.current, hasPosition: !!position });
      return;
    }

    console.log('📍 Updating user location to:', { lat: position.lat.toFixed(6), lng: position.lng.toFixed(6) });

    if (map && map.tagName === 'GMP-MAP-3D') {
      // For Model3DInteractiveElement: direct position assignment works!
      try {
        userMarkerRef.current.position = { lat: position.lat, lng: position.lng };
        console.log('✅ 3D marker position updated (Model3D)');
      } catch (error) {
        console.error('❌ Failed to update 3D marker:', error);
      }
    } else if (userMarkerRef.current.setPosition) {
      // Update 2D marker position
      userMarkerRef.current.setPosition({ lat: position.lat, lng: position.lng });
      console.log('✅ 2D marker position updated');

      // Update accuracy circle
      if (accuracyCircleRef.current && accuracy) {
        accuracyCircleRef.current.setCenter({ lat: position.lat, lng: position.lng });
        accuracyCircleRef.current.setRadius(accuracy);
        console.log('✅ Accuracy circle updated:', accuracy + 'm');
      }
    }
  }, [position, accuracy, map]);

  // TODO: Marker rendering disabled - will use 3D objects instead
  /*
  // Render coins as Google Maps markers
  useEffect(() => {
    if (!map || !coins.length) return;

    // Handle 3D map markers differently
    if (map.tagName === 'GMP-MAP-3D') {
      console.log('🪙 Rendering', coins.length, 'coins as 3D markers');

      const marker3ds: any[] = [];

      const loadMarkers = async () => {
        const { Marker3DElement } = await window.google.maps.importLibrary('maps3d') as any;

        coins.forEach((coin) => {
          if (coin.value === 1) {
            // Randomly show either image or label "1" for value 1 coins
            const useImage = Math.random() > 0.5;

            if (useImage) {
              // Use custom image for value 1 coins
              const coinImg = document.createElement('img');
              coinImg.src = '/1coinv2.png';

              const marker3d = new Marker3DElement({
                position: { lat: coin.position.lat, lng: coin.position.lng },
                altitudeMode: 'CLAMP_TO_GROUND',
                extruded: true, // Keeps marker visible at all zoom levels
              });

              const templateForImg = document.createElement('template');
              templateForImg.content.append(coinImg);
              marker3d.append(templateForImg);

              // Add click listener
              marker3d.addEventListener('gmp-click', async () => {
                console.log('💰 Coin clicked:', coin.value);

                // Show collection animation at center of screen
                const animId = `anim_${Date.now()}`;
                setCollectionAnimations(prev => [...prev, {
                  id: animId,
                  value: coin.value,
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                }]);

                // Remove animation after 1 second
                setTimeout(() => {
                  setCollectionAnimations(prev => prev.filter(a => a.id !== animId));
                }, 1000);

                const success = await attemptCollectCoin(coin);
                if (success && marker3d.parentNode) {
                  marker3d.parentNode.removeChild(marker3d);
                }
              });

              map.append(marker3d);
              marker3ds.push(marker3d);
            } else {
              // Use label "1"
              const marker3d = new Marker3DElement({
                position: { lat: coin.position.lat, lng: coin.position.lng },
                altitudeMode: 'CLAMP_TO_GROUND',
                label: '1',
                extruded: true, // Keeps marker visible at all zoom levels
              });

              // Add click listener
              marker3d.addEventListener('gmp-click', async () => {
                console.log('💰 Coin clicked:', coin.value);

                // Show collection animation at center of screen
                const animId = `anim_${Date.now()}`;
                setCollectionAnimations(prev => [...prev, {
                  id: animId,
                  value: coin.value,
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                }]);

                // Remove animation after 1 second
                setTimeout(() => {
                  setCollectionAnimations(prev => prev.filter(a => a.id !== animId));
                }, 1000);

                const success = await attemptCollectCoin(coin);
                if (success && marker3d.parentNode) {
                  marker3d.parentNode.removeChild(marker3d);
                }
              });

              map.append(marker3d);
              marker3ds.push(marker3d);
            }
          } else {
            // Use label for other coin values (just the number)
            const marker3d = new Marker3DElement({
              position: { lat: coin.position.lat, lng: coin.position.lng },
              altitudeMode: 'CLAMP_TO_GROUND',
              label: coin.value.toString(),
              extruded: true, // Keeps marker visible at all zoom levels
            });

            // Add click listener
            marker3d.addEventListener('gmp-click', async () => {
              console.log('💰 Coin clicked:', coin.value);

              // Show collection animation at center of screen
              const animId = `anim_${Date.now()}`;
              setCollectionAnimations(prev => [...prev, {
                id: animId,
                value: coin.value,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
              }]);

              // Remove animation after 1 second
              setTimeout(() => {
                setCollectionAnimations(prev => prev.filter(a => a.id !== animId));
              }, 1000);

              const success = await attemptCollectCoin(coin);
              if (success && marker3d.parentNode) {
                marker3d.parentNode.removeChild(marker3d);
              }
            });

            map.append(marker3d);
            marker3ds.push(marker3d);
          }
        });
      };

      loadMarkers();

      console.log('✅', marker3ds.length, '3D coin markers added');

      // Cleanup function
      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) {
            marker.parentNode.removeChild(marker);
          }
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      console.log('🏠 Rendering', homebases.length, 'homebases as 3D markers');

      const marker3ds: any[] = [];

      homebases.forEach((homebase) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${homebase.position.lat},${homebase.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '🏠');

        marker3d.addEventListener('click', () => {
          console.log('🏠 Homebase clicked:', homebase.name);
          alert(`🏠 ${homebase.name}\n\n${homebase.description || ''}\n\nAddress: ${homebase.address}\nPlus Code: ${homebase.plusCode}`);
        });

        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });

      console.log('✅', marker3ds.length, 'Homebase 3D markers added');

      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) {
            marker.parentNode.removeChild(marker);
          }
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      console.log('🔥 Rendering', phoenixCoins.length, 'Phoenix Coins as 3D markers (rare)');

      const marker3ds: any[] = [];

      phoenixCoins.forEach((coin) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${coin.position.lat},${coin.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '🔥');

        marker3d.addEventListener('click', async () => {
          console.log('🔥 Phoenix Coin clicked');
          const success = await attemptCollectPhoenixCoin(coin);
          if (success && marker3d.parentNode) {
            marker3d.parentNode.removeChild(marker3d);
          }
        });

        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });

      console.log('✅', marker3ds.length, 'Phoenix Coin 3D markers added');

      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) {
            marker.parentNode.removeChild(marker);
          }
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      console.log('⭐ Rendering', novaCoins.length, 'Nova Coins as 3D markers (semi-rare)');

      const marker3ds: any[] = [];

      novaCoins.forEach((coin) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${coin.position.lat},${coin.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '⭐');

        marker3d.addEventListener('click', async () => {
          console.log('⭐ Nova Coin clicked');
          const success = await attemptCollectNovaCoin(coin);
          if (success && marker3d.parentNode) {
            marker3d.parentNode.removeChild(marker3d);
          }
        });

        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });

      console.log('✅', marker3ds.length, 'Nova Coin 3D markers added');

      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) {
            marker.parentNode.removeChild(marker);
          }
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      console.log('🎁 Rendering', giftCards.length, 'Gift Cards as 3D markers');

      const marker3ds: any[] = [];

      giftCards.forEach((giftCard) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${giftCard.position.lat},${giftCard.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '🎁');

        marker3d.addEventListener('click', () => {
          alert(`🎁 ${giftCard.title}\n\n${giftCard.description}\n\nValue: $${giftCard.value}\nMerchant: ${giftCard.merchantName}\n\nGet within ${giftCard.proximityRequired} feet to claim!`);
        });

        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });

      console.log('✅', marker3ds.length, 'Gift Card 3D markers added');

      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) {
            marker.parentNode.removeChild(marker);
          }
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      const marker3ds: any[] = [];
      arExperiences.forEach((arExp) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${arExp.position.lat},${arExp.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '📱');
        marker3d.addEventListener('click', () => {
          alert(`📱 ${arExp.title}\n\n${arExp.description}\n\nGet within ${arExp.proximityRequired} feet to activate!`);
        });
        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });
      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) marker.parentNode.removeChild(marker);
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      const marker3ds: any[] = [];
      terminusStops.forEach((stop) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${stop.position.lat},${stop.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '🚉');
        marker3d.addEventListener('click', () => {
          alert(`🚉 ${stop.name}\n\n${stop.description}\n\nBadges: ${stop.badges?.join(', ') || 'Various'}\n\nGet within ${stop.proximityRequired} feet to participate!`);
        });
        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });
      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) marker.parentNode.removeChild(marker);
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      const marker3ds: any[] = [];
      grillz.forEach((grillzLoc) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${grillzLoc.position.lat},${grillzLoc.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '✨');
        marker3d.addEventListener('click', () => {
          alert(`✨ ${grillzLoc.name}\n\n${grillzLoc.description}\n\nGet within ${grillzLoc.proximityRequired} feet to claim!`);
        });
        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });
      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) marker.parentNode.removeChild(marker);
        });
      };
    }

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

    // Handle 3D map markers
    if (map.tagName === 'GMP-MAP-3D') {
      const marker3ds: any[] = [];
      lpwChicken.forEach((lpw) => {
        const marker3d = document.createElement('gmp-marker-3d') as any;
        marker3d.setAttribute('position', `${lpw.position.lat},${lpw.position.lng}`);
        marker3d.setAttribute('altitude-mode', 'relative-to-ground');
        marker3d.setAttribute('label', '🍗');
        marker3d.addEventListener('click', () => {
          alert(`🍗 ${lpw.name}\n\n${lpw.description}\n\nGet within ${lpw.proximityRequired} feet to find that Lemon Pepper Wet!`);
        });
        map.appendChild(marker3d);
        marker3ds.push(marker3d);
      });
      return () => {
        marker3ds.forEach(marker => {
          if (marker.parentNode) marker.parentNode.removeChild(marker);
        });
      };
    }

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
  */

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
      {/* Google 3D Maps Container - DO NOT set center/range/tilt as JSX props */}
      <gmp-map-3d
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          touchAction: 'none',
          pointerEvents: 'auto',
        }}
      />

      <TopBar
        onNotificationClick={() => setActivePanel('notifications')}
        onProfileClick={() => setActivePanel('profile')}
      />

      {/* Expandable Menu Bar */}
      <ExpandableMenu
        onPinClick={() => {
          // Recenter 3D map on user location (manual recenter)
          if (mapRef.current && position) {
            const map3d = mapRef.current as any;
            // Use property assignment to trigger smooth animation
            map3d.center = { lat: position.lat, lng: position.lng };
            console.log('📍 Manually recentered to:', position);
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

        {/* 3D Map Rotation Controls */}
        {map && map.tagName === 'GMP-MAP-3D' && (
          <>
            <div className="bg-black/70 backdrop-blur-md rounded-full p-2 shadow-lg">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      const map3d = mapRef.current as any;
                      const currentTilt = parseFloat(map3d.getAttribute('tilt') || '50');
                      map3d.setAttribute('tilt', Math.min(90, currentTilt + 10).toString());
                    }
                  }}
                  className="text-white text-xl hover:scale-110 transition-transform"
                  title="Tilt up"
                >
                  ⬆️
                </button>
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      const map3d = mapRef.current as any;
                      const currentTilt = parseFloat(map3d.getAttribute('tilt') || '50');
                      map3d.setAttribute('tilt', Math.max(0, currentTilt - 10).toString());
                    }
                  }}
                  className="text-white text-xl hover:scale-110 transition-transform"
                  title="Tilt down"
                >
                  ⬇️
                </button>
              </div>
            </div>

            <div className="bg-black/70 backdrop-blur-md rounded-full p-2 shadow-lg">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      const map3d = mapRef.current as any;
                      const currentHeading = parseFloat(map3d.getAttribute('heading') || '0');
                      map3d.setAttribute('heading', ((currentHeading - 45 + 360) % 360).toString());
                    }
                  }}
                  className="text-white text-xl hover:scale-110 transition-transform"
                  title="Rotate counter-clockwise"
                >
                  ↶
                </button>
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      const map3d = mapRef.current as any;
                      const currentHeading = parseFloat(map3d.getAttribute('heading') || '0');
                      map3d.setAttribute('heading', ((currentHeading + 45) % 360).toString());
                    }
                  }}
                  className="text-white text-xl hover:scale-110 transition-transform"
                  title="Rotate clockwise"
                >
                  ↷
                </button>
              </div>
            </div>
          </>
        )}

        {debugMode && (
          <button
            onClick={() => {
              if (mapRef.current) {
                const map3d = mapRef.current as any;
                const currentTilt = parseFloat(map3d.getAttribute('tilt') || '50');
                if (currentTilt > 30) {
                  // Low tilt (more top-down)
                  map3d.setAttribute('tilt', '15');
                  map3d.setAttribute('range', '1500');
                  console.log('🗺️ Switched to top-down view');
                } else {
                  // Medium tilt (bird's eye)
                  map3d.setAttribute('tilt', '50');
                  map3d.setAttribute('range', '2000');
                  console.log('🏙️ Switched to bird\'s eye view');
                }
              }
            }}
            className="bg-black/70 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-black/80 transition-all active:scale-95"
          >
            {(() => {
              const currentTilt = parseFloat((mapRef.current as any)?.getAttribute('tilt') || '50');
              return currentTilt > 30 ? '🦅 Bird View' : '🗺️ Top View';
            })()}
          </button>
        )}
      </div>

      {/* Coin Counter - Disabled for now (using 3D objects instead) */}
      {/* <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-20 bg-primary-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-xl pointer-events-none">
        <span className="text-lg font-bold">🪙 {coins.length} coins nearby</span>
      </div> */}

      {/* Debug info - only visible in debug mode */}
      {debugMode && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white text-xs p-3 rounded-lg backdrop-blur-sm max-w-xs">
          <div className="font-bold mb-1">Debug Info (3D Map):</div>
          <div>Lat: {position.lat.toFixed(6)}</div>
          <div>Lng: {position.lng.toFixed(6)}</div>
          <div>GPS Accuracy: {gpsAccuracy ? `${gpsAccuracy.toFixed(1)}m` : 'unknown'}</div>
          <div>Maps 3D: {mapsLoaded ? '✓' : '✗'}</div>
          <div>Mode: {(mapRef.current as any)?.getAttribute('mode') || 'none'}</div>
          <div>Tilt: {(mapRef.current as any)?.getAttribute('tilt') || '50'}°</div>
          <div>Heading: {(mapRef.current as any)?.getAttribute('heading') || '0'}°</div>
          <div>Range: {(mapRef.current as any)?.getAttribute('range') || '2000'}m</div>
          <div>Center: {(mapRef.current as any)?.getAttribute('center') || 'loading'}</div>
          <div>Shadow: {(mapRef.current as any)?.shadowRoot ? '✓' : '✗'}</div>
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

      {/* Collection Animations */}
      {collectionAnimations.map(anim => (
        <div
          key={anim.id}
          style={{
            position: 'fixed',
            left: anim.x,
            top: anim.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 10000,
            pointerEvents: 'none',
            animation: 'collectCoin 1s ease-out forwards',
          }}
          className="text-6xl font-bold text-yellow-400"
        >
          +{anim.value}
        </div>
      ))}

      {/* Collection Animation CSS */}
      <style>{`
        @keyframes collectCoin {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -100px) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -200px) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
