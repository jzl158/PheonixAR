import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'location', icon: '📍', path: '/map' },
    { id: 'menu', icon: '☰', path: '/menu' },
    { id: 'yay', label: 'YAY!', path: '/map' },
    { id: 'cart', icon: '🛒', path: '/shop' },
    { id: 'search', icon: '🔍', path: '/search' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 safe-bottom">
      <div className="bg-black/80 backdrop-blur-lg rounded-t-3xl mx-4 mb-4 px-6 py-4">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center transition-all ${
                location.pathname === item.path
                  ? 'text-primary-500 scale-110'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label ? (
                <span className="text-sm font-bold">{item.label}</span>
              ) : (
                <span className="text-2xl">{item.icon}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
