import { useState, useEffect } from 'react';
import type { Coordinates, GeolocationState } from '../types';

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: true,
  });
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: 'Geolocation is not supported by your browser',
        isLoading: false,
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      const coords: Coordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const accuracyMeters = position.coords.accuracy;
      setAccuracy(accuracyMeters);

      console.log('📍 GPS Update:', {
        timestamp: new Date().toLocaleTimeString(),
        lat: coords.lat.toFixed(6),
        lng: coords.lng.toFixed(6),
        accuracy: accuracyMeters + 'm',
        speed: position.coords.speed ? position.coords.speed + 'm/s' : 'N/A',
        heading: position.coords.heading ? position.coords.heading + '°' : 'N/A',
      });
      setState({
        position: coords,
        error: null,
        isLoading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        position: null,
        error: error.message,
        isLoading: false,
      });
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    // Watch position for updates
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { ...state, accuracy };
}
