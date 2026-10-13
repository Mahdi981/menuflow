'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';

type Tone = 'light' | 'dark';

// ألوان النص حسب الخلفية: 400 على الداكن، 700 على الفاتح
const TEXT = {
  gray: { light: 'text-gray-600', dark: 'text-gray-400' },
  green: { light: 'text-green-700', dark: 'text-green-400' },
  red: { light: 'text-red-700', dark: 'text-red-400' },
  orange: { light: 'text-orange-700', dark: 'text-orange-400' },
} as const;

export default function NotificationButton({
  tone = 'light',
}: {
  tone?: Tone;
}) {
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
        <BellOff size={14} className={TEXT.gray[tone]} />
        <span className={`hidden sm:inline text-xs font-medium ${TEXT.gray[tone]}`}>
          Not supported
        </span>
      </div>
    );
  }

  // Granted
  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
        <Bell size={14} className={TEXT.green[tone]} />
        <span className={`hidden sm:inline text-xs font-medium ${TEXT.green[tone]}`}>
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
        aria-label="Notifications blocked"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition"
      >
        <BellOff size={14} className={TEXT.red[tone]} />
        <span className={`hidden sm:inline text-xs font-medium ${TEXT.red[tone]}`}>
          Blocked
        </span>
      </button>
    );
  }

  // Default — needs permission
  return (
    <button
      onClick={request}
      disabled={loading}
      aria-label="Enable notifications"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={14} className={`animate-spin ${TEXT.orange[tone]}`} />
      ) : (
        <Bell size={14} className={TEXT.orange[tone]} />
      )}
      <span className={`hidden sm:inline text-xs font-medium ${TEXT.orange[tone]}`}>
        {loading ? 'Requesting...' : 'Enable Notifications'}
      </span>
    </button>
  );
}