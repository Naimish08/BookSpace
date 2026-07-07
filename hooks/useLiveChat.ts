'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/superbase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

export function useLiveChat(userId: string, username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchInitialMessages() {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data: ChatMessage[] = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error('Failed to fetch chat messages:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialMessages();

    const channel = supabase.channel('community-chat', {
      config: { presence: { key: userId } },
    });

    channel
      .on('broadcast', { event: 'new-message' }, (payload) => {
        const incomingMessage = payload.payload as ChatMessage;
        if (incomingMessage.user_id !== userId) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === incomingMessage.id);
            if (exists) return prev;
            return [...prev, incomingMessage];
          });
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const uniqueUsers = new Set(Object.keys(state));
        setOnlineCount(uniqueUsers.size);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ userId, username });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, username]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();

      const optimisticMessage: ChatMessage = {
        id: tempId,
        user_id: userId,
        username,
        message: text.trim(),
        created_at: now,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, username, message: text.trim() }),
        });

        if (res.ok) {
          const saved: ChatMessage = await res.json();

          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? saved : m))
          );

          channelRef.current?.send({
            type: 'broadcast',
            event: 'new-message',
            payload: saved,
          });
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          console.error('Failed to send message');
        }
      } catch (error) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        console.error('Failed to send message:', error);
      }
    },
    [userId, username]
  );

  return { messages, onlineCount, sendMessage, loading };
}
