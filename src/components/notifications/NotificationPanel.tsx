import { useState } from 'react';
import type { Notification } from '../../types/locations';

interface NotificationPanelProps {
  onClose: () => void;
}

// Mock notifications for demonstration
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'nearby-token',
    title: 'Phoenix Coin Nearby!',
    message: 'A rare Phoenix Coin has appeared 0.2 miles away. Hurry before it disappears!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
  },
  {
    id: 'notif-2',
    type: 'new-offer',
    title: 'New Phoenix Offer Available',
    message: 'Free coffee offer unlocked at Octane Coffee! Check your offers.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
  },
  {
    id: 'notif-3',
    type: 'friend-interaction',
    title: 'New Follower',
    message: 'SkyRunner23 started following you!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
  },
  {
    id: 'notif-4',
    type: 'check-in-reminder',
    title: 'Daily Check-In',
    message: "Don't forget to collect your daily bonus! +50 points waiting.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
  },
  {
    id: 'notif-5',
    type: 'nearby-location',
    title: 'Homebase Nearby',
    message: 'Atlanta Blockchain Center is 0.5 miles away. Visit to earn badges!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
];

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'nearby-token':
        return '🪙';
      case 'nearby-location':
        return '📍';
      case 'offer-expiring':
        return '⏰';
      case 'new-offer':
        return '🎁';
      case 'check-in-reminder':
        return '✅';
      case 'friend-interaction':
        return '👥';
      default:
        return '🔔';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl font-bold">🔔 Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white text-2xl hover:scale-110 transition-transform"
            >
              ✕
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-white bg-opacity-30 text-white'
                  : 'text-white text-opacity-70 hover:text-opacity-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'unread'
                  ? 'bg-white bg-opacity-30 text-white'
                  : 'text-white text-opacity-70 hover:text-opacity-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="p-3 border-b border-gray-700">
            <button
              onClick={markAllAsRead}
              className="text-primary-400 text-sm font-semibold hover:text-primary-300 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400">No {filter === 'unread' ? 'unread' : ''} notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full text-left p-4 hover:bg-gray-800 transition-colors ${
                    !notification.read ? 'bg-blue-900 bg-opacity-20' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-white font-semibold text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                      <p className="text-gray-500 text-xs">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
