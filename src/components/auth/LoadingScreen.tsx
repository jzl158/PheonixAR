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
      // Left side confetti - red, white, blue, purple
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ['#EF4444', '#FFFFFF', '#3B82F6', '#A855F7'],
        scalar: 1.5, // 50% bigger pieces
        gravity: 1,
        drift: 0.2,
      });

      // Right side confetti
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ['#EF4444', '#FFFFFF', '#3B82F6', '#A855F7'],
        scalar: 1.5,
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
    sessionStorage.setItem('hasSeenIntro', 'true');
    navigate('/phone');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-end pb-32"
      style={{
        backgroundColor: '#1a1a2e',
        backgroundImage: 'url(/CityExplorer.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Test text to verify component is rendering */}
      <div className="absolute top-20 left-0 right-0 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">SkylARk</h1>
        <p className="text-white text-sm">Image path: /CityExplorer.png</p>
      </div>

      {/* Start Exploring Button */}
      <button
        onClick={handleStartExploring}
        className="px-12 py-4 bg-orange-600 hover:bg-orange-700 text-white text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 z-50 border-4 border-white"
      >
        Start Exploring
      </button>
    </div>
  );
}
