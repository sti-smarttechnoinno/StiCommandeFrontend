'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export interface DelegateEvent {
  id: string;
  name: string;
  status: string;
  isOnline: boolean;
  lastActivity: string;
}

export interface OrderEvent {
  type: string;
  order?: {
    id: string;
    order_code: string;
    client_name: string;
    delegate_name: string;
    total_amount: number;
    status: string;
    created_at?: string;
  };
  delegate?: DelegateEvent;
}

// Synthesize pleasant dual-tone audio chime using Web Audio API
function playChimeSound() {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Tone 1: 523.25 Hz (C5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Tone 2: 659.25 Hz (E5) delayed slightly
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (_) {
    // Graceful fallback if AudioContext is blocked by browser autoplay policy
  }
}

export function useWebSocketOrders() {
  const [unvalidatedCount, setUnvalidatedCount] = useState<number>(0);
  const [lastEvent, setLastEvent] = useState<OrderEvent | null>(null);
  const [lastDelegateEvent, setLastDelegateEvent] = useState<DelegateEvent | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const seenEventIds = useRef<Set<string>>(new Set());

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const wsCustomUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8085';

  // Fetch initial unvalidated orders count from backend
  const fetchUnvalidatedCount = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/orders?status=pending&pageSize=1`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.total === 'number') {
          setUnvalidatedCount(data.total);
        }
      }
    } catch (_) {
      // Fallback
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchUnvalidatedCount();
  }, [fetchUnvalidatedCount]);

  const handleOrderEvent = useCallback((data: OrderEvent) => {
    if (data.type === 'DELEGATE_STATUS_CHANGED' && data.delegate) {
      setLastDelegateEvent(data.delegate);
      return;
    }

    if (!data.order?.id) return;

    // Deduplicate events
    const eventKey = `${data.type}_${data.order.id}`;
    if (seenEventIds.current.has(eventKey)) return;
    seenEventIds.current.add(eventKey);

    setLastEvent(data);

    if (data.type === 'ORDER_CREATED' && data.order) {
      // Play notification chime sound
      playChimeSound();

      // Increment unvalidated count
      setUnvalidatedCount((prev) => prev + 1);

      // Trigger Sonner toast notification
      const code = data.order.order_code || 'Nouvelle Commande';
      const client = data.order.client_name || 'Client';
      const amount = data.order.total_amount ? `${Number(data.order.total_amount).toLocaleString()} DA` : '';

      toast.success(`Nouvelle commande reçue !`, {
        description: `${code} — ${client} (${amount})`,
        duration: 6000,
      });
    }
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let pollInterval: NodeJS.Timeout | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isSubscribed = true;

    function stopFallbackPolling() {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    }

    function startFallbackPolling() {
      if (!isSubscribed || pollInterval) return;
      setIsConnected(false);

      async function pollLatestEvents() {
        if (!isSubscribed) return;
        try {
          const res = await fetch(`${apiBaseUrl}/orders/stream`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.events)) {
              data.events.forEach((ev: OrderEvent) => handleOrderEvent(ev));
            }
          }
        } catch (_) {}
      }

      pollLatestEvents();
      pollInterval = setInterval(pollLatestEvents, 15000);
    }

    function connectWebSocket() {
      if (!isSubscribed) return;

      try {
        ws = new WebSocket(wsCustomUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isSubscribed) return;
          setIsConnected(true);
          stopFallbackPolling();
        };

        ws.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            const data: OrderEvent = JSON.parse(event.data);
            handleOrderEvent(data);
          } catch (_) {}
        };

        ws.onclose = () => {
          if (!isSubscribed) return;
          setIsConnected(false);
          startFallbackPolling();
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          reconnectTimeout = setTimeout(connectWebSocket, 10000);
        };

        ws.onerror = () => {
          try {
            ws?.close();
          } catch (_) {}
        };
      } catch (_) {
        startFallbackPolling();
      }
    }

    connectWebSocket();

    return () => {
      isSubscribed = false;
      stopFallbackPolling();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [apiBaseUrl, wsCustomUrl, handleOrderEvent]);

  return { unvalidatedCount, lastEvent, lastDelegateEvent, isConnected, refreshCount: fetchUnvalidatedCount };
}
