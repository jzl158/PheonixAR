import { useState, useEffect } from 'react';
import type { Coordinates, GeolocationState } from '../types';

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: true,
  });

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
      console.log('📍 GPS Update:', {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: position.coords.accuracy + 'm',
        altitude: position.coords.altitude,
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

  return state;
}
