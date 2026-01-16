// Initialize Google Maps API Loader
(async () => {
  const { APILoader } = await import('https://unpkg.com/@googlemaps/extended-component-library@0.6/api_loader.js');

  // Get API key from window (set by React)
  if (window.GOOGLE_MAPS_API_KEY) {
    APILoader.apiKey = window.GOOGLE_MAPS_API_KEY;
  }

  // Load the 3D map component
  await import('https://unpkg.com/@googlemaps/extended-component-library@0.6/place_building_blocks/place_overview.js');
})();
