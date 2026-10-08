'use client';

import { useEffect, useRef } from 'react';

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  type: 'delivery' | 'pickup';
};

export function useOrderNotifications(orders: Order[]) {
  const seenIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    audioRef.current = new Audio('/notification.mp3');
  }, []);

  // Request permission once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Watch orders
  useEffect(() => {
    if (!initialized.current) {
      orders.forEach((o) => seenIds.current.add(o.id));
      initialized.current = true;
      return;
    }

    const newOrders = orders.filter((o) => !seenIds.current.has(o.id));
    if (newOrders.length === 0) return;

    newOrders.forEach((order) => {
      seenIds.current.add(order.id);
    });

    const latest = newOrders[0];

    // 1. Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // 2. Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 New Order!', {
        body: `${latest.order_number} — ${latest.customer_name} — $${latest.total.toFixed(2)}`,
        icon: '/favicon.ico',
        tag: latest.id,
        requireInteraction: true,
      });
    }

    // 3. Change tab title
    const originalTitle = document.title;
    document.title = `🔴 New Order (${newOrders.length})`;
    setTimeout(() => {
      document.title = originalTitle;
    }, 8000);
  }, [orders]);
}