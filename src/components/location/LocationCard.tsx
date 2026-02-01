interface LocationCardProps {
  name: string;
  category: string;
  distance: number; // in miles
  imageUrl?: string;
  activationsCount?: number;
  onClose: () => void;
  onCollect?: () => void; // Optional collect action
  collectLabel?: string; // Label for collect button
  onActivationsClick?: () => void; // Optional activations click
}

export function LocationCard({
  name,
  category,
  distance,
  imageUrl,
  activationsCount = 0,
  onClose,
  onCollect,
  collectLabel = 'Collect',
  onActivationsClick,
}: LocationCardProps) {
  return (
    <div
      className="fixed bottom-28 left-4 right-4 z-50 animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#0F0428] rounded-2xl p-4 shadow-2xl border-2 border-[#E6C787]/30">
        <div className="flex items-center gap-4">
          {/* Location Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-xl border-4 border-[#E6C787] overflow-hidden bg-gray-800">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  📍
                </div>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="flex-1 min-w-0">
            {/* Distance */}
            <div className="text-[#E6C787] text-xs font-semibold mb-1">
              {distance.toFixed(1)} Mi
            </div>

            {/* Location Name */}
            <h3 className="text-white text-xl font-bold mb-1 truncate">
              {name}
            </h3>

            {/* Category */}
            <p className="text-gray-300 text-sm mb-3">{category}</p>

            {/* Buttons */}
            {onCollect ? (
              <button
                onClick={onCollect}
                className="bg-[#E6C787] hover:bg-[#E6C787]/90 text-gray-900 font-bold text-sm px-4 py-2 rounded-full transition-colors"
              >
                {collectLabel}
              </button>
            ) : (
              <button
                onClick={onActivationsClick}
                className="bg-[#E6C787] hover:bg-[#E6C787]/90 text-gray-900 font-bold text-sm px-4 py-2 rounded-full transition-colors"
              >
                Available Activations ({activationsCount})
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/70 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Slide-up animation */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
