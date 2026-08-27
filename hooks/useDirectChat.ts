'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/superbase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Represents a direct message within a private conversation.
 * Includes sender profile information for display purposes.
 */
export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: {
    id: string;
    username: string | null;
    name: string | null;
  };
}

/**
 * Custom hook for real-time direct messaging within a conversation.
 * Mirrors the architecture of useLiveChat but scoped to a specific conversation.
 *
 * Uses Supabase Realtime Broadcast on a per-conversation channel (`dm-{conversationId}`)
 * for instant message delivery, with optimistic UI updates.
 *
 * @param conversationId - The UUID of the conversation to subscribe to
 * @param userId - The authenticated user's UUID (sender)
 * @param username - The authenticated user's display name
 */
export function useDirectChat(
  conversationId: string | null,
  userId: string,
  username: string
) {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentConversationRef = useRef<string | null>(null);

  // ─── Fetch initial messages & subscribe to Realtime channel ─────
  useEffect(() => {
    // Cleanup previous channel if conversation changed
    if (channelRef.current) {
      const supabase = createClient();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Reset state when conversation changes
    setMessages([]);
    setLoading(true);
    currentConversationRef.current = conversationId;

    if (!conversationId) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function fetchInitialMessages() {
      try {
        const res = await fetch(
          `/api/conversations/${conversationId}/messages?userId=${userId}`
        );
        if (res.ok) {
          const data: DirectMessage[] = await res.json();
          // Only update if this is still the active conversation
          if (currentConversationRef.current === conversationId) {
            setMessages(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch DM messages:', error);
      } finally {
        if (currentConversationRef.current === conversationId) {
          setLoading(false);
        }
      }
    }

    fetchInitialMessages();

    // ─── Supabase Realtime Broadcast channel (per-conversation) ───
    const channel = supabase.channel(`dm-${conversationId}`);

    channel
      .on('broadcast', { event: 'new-dm' }, (payload) => {
        const incoming = payload.payload as DirectMessage;
        // Only append messages from the other user (own are handled optimistically)
        if (incoming.sender_id !== userId) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === incoming.id);
            if (exists) return prev;
            return [...prev, incoming];
          });
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, userId]);

  // ─── Send a direct message with optimistic UI ──────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !conversationId) return;

      const tempId = crypto.randomUUID();
      const now = new Date().toISOString();

      // Optimistic message object (displayed immediately)
      const optimisticMessage: DirectMessage = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: userId,
        message: text.trim(),
        created_at: now,
        sender: { id: userId, username, name: null },
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        const res = await fetch(
          `/api/conversations/${conversationId}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderId: userId,
              message: text.trim(),
            }),
          }
        );

        if (res.ok) {
          const saved: DirectMessage = await res.json();

          // Replace optimistic message with server-confirmed version
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? saved : m))
          );

          // Broadcast to the other participant via Realtime
          channelRef.current?.send({
            type: 'broadcast',
            event: 'new-dm',
            payload: saved,
          });
        } else {
          // Rollback on failure
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          console.error('Failed to send DM');
        }
      } catch (error) {
        // Rollback on network error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        console.error('Failed to send DM:', error);
      }
    },
    [conversationId, userId, username]
  );

  return { messages, sendMessage, loading };
}
