import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Model3DViewerProps {
  onClose: () => void;
}

interface Coin {
  id: string;
  position: { lat: number; lng: number };
  value: number;
}

// Generate random coins around a center point
function generateCoins(center: [number, number], count: number = 10): Coin[] {
  const coins: Coin[] = [];
  const COIN_VALUES = [1, 3, 5, 7, 10, 15, 20, 25];
  const radius = 0.001; // Approximately 100 meters

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * radius;

    const lat = center[1] + distance * Math.cos(angle);
    const lng = center[0] + distance * Math.sin(angle);
    const value = COIN_VALUES[Math.floor(Math.random() * COIN_VALUES.length)];

    coins.push({
      id: `coin_${i}`,
      position: { lat, lng },
      value,
    });
  }

  return coins;
}

export function Model3DViewer({ onClose }: Model3DViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkZXRyYWNrZWQ1IiwiYSI6ImNta2pjenhnMzEyeXQzZW9uZTc3NTUzdXIifQ.MjLjvkL2VCSaR_3IkulVlQ';

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      zoom: 18,
      center: [148.9819, -35.3981],
      pitch: 60,
      antialias: true,
    });

    mapRef.current = map;

    // Parameters to ensure the model is georeferenced correctly on the map
    const modelOrigin: [number, number] = [148.9819, -35.39847];
    const modelAltitude = 0;
    const modelRotate: [number, number, number] = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    // Transformation parameters to position, rotate and scale the 3D model onto the map
    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    // Configuration of the custom layer for a 3D model
    const customLayer: mapboxgl.CustomLayerInterface = {
      id: '3d-model',
      type: 'custom',
      renderingMode: '3d',
      onAdd: function (map, gl) {
        // @ts-ignore - Adding custom properties
        this.camera = new THREE.Camera();
        // @ts-ignore
        this.scene = new THREE.Scene();

        // Create two three.js lights to illuminate the model
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        // @ts-ignore
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        // @ts-ignore
        this.scene.add(directionalLight2);

        // Use the three.js GLTF loader to add the 3D model to the three.js scene
        const loader = new GLTFLoader();
        loader.load('/assets/result.glb', (gltf) => {
          // @ts-ignore
          this.scene.add(gltf.scene);
        });

        // @ts-ignore
        this.map = map;

        // Use the Mapbox GL JS map canvas for three.js
        // @ts-ignore
        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });

        // @ts-ignore
        this.renderer.autoClear = false;
      },
      render: function (_gl, matrix) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          modelTransform.rotateX
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 1, 0),
          modelTransform.rotateY
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 0, 1),
          modelTransform.rotateZ
        );

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
          )
          .scale(
            new THREE.Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale
            )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

        // @ts-ignore
        this.camera.projectionMatrix = m.multiply(l);
        // @ts-ignore
        this.renderer.resetState();
        // @ts-ignore
        this.renderer.render(this.scene, this.camera);
        // @ts-ignore
        this.map.triggerRepaint();
      },
    };

    map.on('style.load', () => {
      map.addLayer(customLayer);

      // Generate and add coins to the map
      const coins = generateCoins([148.9819, -35.3981], 15);

      coins.forEach((coin) => {
        // Create coin marker with pulsating aura
        const el = document.createElement('div');
        el.className = 'coin-marker-3d';
        el.style.width = '60px';
        el.style.height = '60px';
        el.style.cursor = 'pointer';

        // Create coin with pulsating aura
        if (coin.value === 1) {
          // Special styling for 1 coins
          el.innerHTML = `
            <div style="position: relative; width: 60px; height: 60px;">
              <div class="coin-aura" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50px;
                height: 50px;
                background: radial-gradient(circle, rgba(251, 191, 36, 0.6), transparent);
                border-radius: 50%;
                animation: pulse-aura 2s ease-in-out infinite;
              "></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                border: 3px solid #d97706;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 20px;
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.7);
                z-index: 1;
              ">1</div>
            </div>
          `;
        } else {
          // Regular coins
          el.innerHTML = `
            <div style="position: relative; width: 60px; height: 60px;">
              <div class="coin-aura" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 50px;
                height: 50px;
                background: radial-gradient(circle, rgba(251, 191, 36, 0.6), transparent);
                border-radius: 50%;
                animation: pulse-aura 2s ease-in-out infinite;
              "></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                border: 3px solid #d97706;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 16px;
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.7);
                z-index: 1;
              ">${coin.value}</div>
            </div>
          `;
        }

        // Add click handler
        el.addEventListener('click', () => {
          alert(`Collected ${coin.value} GSKY!`);
          el.remove();
        });

        // Add marker to map
        new mapboxgl.Marker({ element: el })
          .setLngLat([coin.position.lng, coin.position.lat])
          .addTo(map);
      });

      // Add CSS animation for pulsating aura
      if (!document.getElementById('coin-aura-animation-3d')) {
        const style = document.createElement('style');
        style.id = 'coin-aura-animation-3d';
        style.textContent = `
          @keyframes pulse-aura {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.6;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.3);
              opacity: 0.2;
            }
          }
        `;
        document.head.appendChild(style);
      }
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-white/20 transition-all"
      >
        ✕ Close
      </button>

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
