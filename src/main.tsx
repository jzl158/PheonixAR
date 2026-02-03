import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Load Google Maps 3D API dynamically so the key stays out of committed source
const mapsScript = document.createElement('script');
mapsScript.async = true;
mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&v=beta&libraries=maps3d,marker&callback=initMap`;
document.head.appendChild(mapsScript);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
