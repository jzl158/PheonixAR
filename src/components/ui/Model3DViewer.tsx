import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Model3DViewerProps {
  onClose: () => void;
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
