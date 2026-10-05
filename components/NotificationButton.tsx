'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  // Initialize + watch permission changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('Notification' in window)) {
      setSupported(false);
      return;
    }

    setPermission(Notification.permission);

    // Watch for external changes (user changes browser settings)
    const handler = () => setPermission(Notification.permission);
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  const request = async () => {
    if (!('Notification' in window)) {
      alert('Your browser does not support notifications');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      console.log('🔔 Notification permission:', result);
      setPermission(result);

      if (result === 'granted') {
        // Test notification
        new Notification('Notifications enabled! 🎉', {
          body: 'You will now receive alerts for new orders.',
          icon: '/favicon.ico',
        });
      } else if (result === 'denied') {
        alert(
          'Notifications blocked. Please enable them from browser settings (click the lock icon next to the URL).'
        );
      }
    } catch (err) {
      console.error('Notification error:', err);
      alert('Failed to request notification permission');
    } finally {
      setLoading(false);
    }
  };

  // Not supported
  if (!supported) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/30">
        <BellOff size={14} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-400">
          Not supported
        </span>
      </div>
    );
  }

  // Granted
  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
        <Bell size={14} className="text-green-400" />
        <span className="text-xs font-medium text-green-400">
          Notifications On
        </span>
      </div>
    );
  }

  // Denied
  if (permission === 'denied') {
    return (
      <button
        onClick={() =>
          alert(
            'Notifications blocked. To enable:\n\n1. Click the 🔒 lock icon next to the URL\n2. Set Notifications to "Allow"\n3. Refresh the page'
          )
        }
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition"
      >
        <BellOff size={14} className="text-red-400" />
        <span className="text-xs font-medium text-red-400">Blocked</span>
      </button>
    );
  }

  // Default — needs permission
  return (
    <button
      onClick={request}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={14} className="text-orange-400 animate-spin" />
      ) : (
        <Bell size={14} className="text-orange-400" />
      )}
      <span className="text-xs font-medium text-orange-400">
        {loading ? 'Requesting...' : 'Enable Notifications'}
      </span>
    </button>
  );
}