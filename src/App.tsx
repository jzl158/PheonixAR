import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { LoadingScreen } from './components/auth/LoadingScreen';
import { PhoneInput } from './components/auth/PhoneInput';
import { OTPVerification } from './components/auth/OTPVerification';
import { MapView } from './components/map/MapView';

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

function App() {
  const { isAuthenticated } = useAuthStore();
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    return sessionStorage.getItem('hasSeenIntro') === 'true';
  });

  // Show intro screen only once per session, unless already authenticated
  if (!hasSeenIntro && !isAuthenticated) {
    return <LoadingScreen onStartExploring={() => setHasSeenIntro(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/map" replace /> : <Navigate to="/phone" replace />
          }
        />
        <Route path="/phone" element={<PhoneInput />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
