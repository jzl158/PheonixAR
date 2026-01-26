import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LoadingScreenProps {
  onStartExploring?: () => void;
}

export function LoadingScreen({ onStartExploring }: LoadingScreenProps) {

  useEffect(() => {
    // Trigger confetti animation with bigger pieces
    const duration = 5000; // Run for 5 seconds
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
    if (onStartExploring) {
      onStartExploring();
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-end pb-28"
      style={{
        backgroundImage: 'url(/CityExplorer.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Start Exploring Button - Purple with Glow */}
      <button
        onClick={handleStartExploring}
        className="px-12 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 z-50"
        style={{
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.2)'
        }}
      >
        Start Exploring
      </button>
    </div>
  );
}
