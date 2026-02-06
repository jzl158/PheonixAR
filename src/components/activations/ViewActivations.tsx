import { useState } from 'react';
import { WorldExplorer } from '../world/WorldExplorer';

interface ViewActivationsProps {
  businessName: string;
  businessTagline: string;
  businessLogo?: string;
  onClose: () => void;
  onPlayActivation?: (activationId: string, activationName: string) => void;
}

interface Activation {
  id: string;
  type: string;
  name: string;
  playerCount: number;
  isPopular: boolean;
}

export function ViewActivations({
  businessName,
  businessTagline,
  businessLogo,
  onClose,
  onPlayActivation,
}: ViewActivationsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showWorldExplorer, setShowWorldExplorer] = useState(false);

  const activations: Activation[] = [
    {
      id: '1',
      type: 'Interactive',
      name: 'Fashionsense',
      playerCount: 12,
      isPopular: true,
    },
    {
      id: '2',
      type: '3D World',
      name: 'World Explorer',
      playerCount: 24,
      isPopular: true,
    },
    {
      id: '3',
      type: 'Challenge',
      name: 'Style Master',
      playerCount: 15,
      isPopular: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[#0F0428] z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-[#E6C787]/20">
        <h1 className="text-2xl font-bold text-white">SKYLARK</h1>
        <button onClick={onClose} className="text-[#E6C787] text-2xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Business Header */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {businessLogo ? (
            <img
              src={businessLogo}
              alt={businessName}
              className="w-16 h-16 rounded-full border-2 border-[#E6C787]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl">
              🦚
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{businessName}</h2>
            <p className="text-gray-400 text-sm">{businessTagline}</p>
          </div>
        </div>

        {/* Activations Carousel */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {activations.map((activation) => (
                <div
                  key={activation.id}
                  className="flex-shrink-0 w-80 bg-gradient-to-b from-purple-400 to-purple-600 rounded-3xl p-6 relative"
                  style={{ minHeight: '400px' }}
                >
                  {/* Type Badge & Heart */}
                  <div className="flex justify-between items-start mb-8">
                    <span className="bg-[#E6C787]/90 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full">
                      {activation.type}
                    </span>
                    <button className="text-white text-2xl">
                      ♡
                    </button>
                  </div>

                  {/* Activity Name */}
                  <h3 className="text-white text-4xl font-bold mb-32">
                    {activation.name}
                  </h3>

                  {/* Bottom Section */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-purple-800/80 rounded-2xl p-4 mb-4">
                      <div className="flex items-center justify-center gap-6 text-white text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{activation.playerCount} players</span>
                        </div>
                        {activation.isPopular && (
                          <div className="flex items-center gap-2">
                            <span>🔥</span>
                            <span>Popular Activity</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Play Now Button */}
                    <button
                      onClick={() => {
                        // World Explorer (id '2') launches its own component
                        if (activation.id === '2') {
                          setShowWorldExplorer(true);
                        } else {
                          onPlayActivation?.(activation.id, activation.name);
                        }
                      }}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
                    >
                      <span>▶</span>
                      <span>Play now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {activations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-[#E6C787] w-8'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <h3 className="text-white text-xl font-bold mb-4">About</h3>
          <h4 className="text-white text-2xl font-bold mb-4">{businessName}</h4>

          {/* Social Media Icons */}
          <div className="flex gap-4 mb-6">
            <button className="text-gray-400 hover:text-[#E6C787] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-[#E6C787] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-[#E6C787] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"/>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-[#E6C787] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4m0-4h.01"/>
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed">
            At {businessName} we believe in the power of sustainable fashion and community connection.
            Our thriftwear brand curates unique, pre-loved pieces that tell a story, while empowering
            local communities through eco-conscious style.
          </p>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* World Explorer Modal */}
      {showWorldExplorer && (
        <WorldExplorer onClose={() => setShowWorldExplorer(false)} />
      )}
    </div>
  );
}
