import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

export function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti animation with bigger pieces
    const duration = 15000; // Run for 15 seconds
    const end = Date.now() + duration;

    const frame = () => {
      // Left side confetti
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ['#EF4444', '#FFFFFF', '#3B82F6', '#A855F7'], // red, white, blue, purple
        scalar: 1.5, // Make pieces 50% bigger
        gravity: 1,
        drift: 0.2,
      });

      // Right side confetti
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ['#EF4444', '#FFFFFF', '#3B82F6', '#A855F7'], // red, white, blue, purple
        scalar: 1.5, // Make pieces 50% bigger
        gravity: 1,
        drift: -0.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleStartExploring = () => {
    // Mark intro as seen for this session
    sessionStorage.setItem('hasSeenIntro', 'true');
    navigate('/phone');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Full screen background image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/CityExplorer.png)',
          backgroundColor: '#1a1a1a' // Fallback color
        }}
      />

      {/* Gradient overlay for better button visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      {/* Start Exploring Button - 3/4 down the screen */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-24 px-6">
        <button
          onClick={handleStartExploring}
          className="z-10 px-12 py-4 bg-primary-600 hover:bg-primary-700 text-white text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
}
