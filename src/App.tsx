import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { LoadingScreen } from './components/auth/LoadingScreen';
import { PhoneInput } from './components/auth/PhoneInput';
import { OTPVerification } from './components/auth/OTPVerification';
import { MapView } from './components/map/MapView';
import { WalletLanding } from './components/wallet/WalletLanding';
import { InventoryModal } from './components/inventory/InventoryModal';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/phone" replace />;
}

function WalletWrapper() {
  const navigate = useNavigate();
  const [showInventory, setShowInventory] = useState(false);

  // Mark that user has visited map when navigating to it
  const handleNavigateToMap = () => {
    localStorage.setItem('hasVisitedMap', 'true');
    navigate('/map');
  };

  return (
    <>
      <WalletLanding
        onNavigateToMap={handleNavigateToMap}
        onOpenInventory={() => setShowInventory(true)}
      />
      {showInventory && <InventoryModal onClose={() => setShowInventory(false)} />}
    </>
  );
}

function MapWrapper() {
  // When leaving map, remember user has visited it
  useEffect(() => {
    localStorage.setItem('hasVisitedMap', 'true');
  }, []);

  return <MapView />;
}

function App() {
  const { isAuthenticated } = useAuthStore();
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  // Always show intro screen first (every page load)
  if (!hasSeenIntro) {
    return <LoadingScreen onStartExploring={() => setHasSeenIntro(true)} />;
  }

  // Check if user has visited map before
  const hasVisitedMap = localStorage.getItem('hasVisitedMap') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              hasVisitedMap ? (
                <Navigate to="/map" replace />
              ) : (
                <Navigate to="/wallet" replace />
              )
            ) : (
              <Navigate to="/phone" replace />
            )
          }
        />
        <Route path="/phone" element={<PhoneInput />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapWrapper />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
