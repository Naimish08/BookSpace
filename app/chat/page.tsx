'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/superbase/client';
import { useLiveChat, type ChatMessage } from '@/hooks/useLiveChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageCircle } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login-signup');
        return;
      }

      setUserId(session.user.id);
      setUsername(
        session.user.user_metadata?.username ||
          session.user.user_metadata?.name ||
          session.user.email?.split('@')[0] ||
          'Anonymous'
      );
      setAuthLoading(false);
    }

    checkAuth();
  }, [router]);

  if (authLoading || !userId || !username) {
    return (
      <div className="min-h-screen bg-[#FDE8BE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#462C90]" />
          <p className="text-[#462C90] font-medium text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  return <ChatRoom userId={userId} username={username} />;
}

function ChatRoom({ userId, username }: { userId: string; username: string }) {
  const { messages, onlineCount, sendMessage, loading } = useLiveChat(
    userId,
    username
  );
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!inputValue.trim() || sending) return;
    setSending(true);
    await sendMessage(inputValue);
    setInputValue('');
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDE8BE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#462C90]" />
          <p className="text-[#462C90] font-medium text-lg">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDE8BE] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#462C90]/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#462C90] to-[#483285] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-[#E1B5EE]" />
            <h1 className="text-xl font-bold text-white">
              💬 Community Chat
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm text-white/90 font-medium">
              {onlineCount} online
            </span>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-gradient-to-b from-[#462C90] to-[#241943] px-4 py-4 space-y-3"
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-[#BA7FCB]/30 mx-auto mb-4" />
                <p className="text-[#E1B5EE]/60 text-lg font-medium">
                  No messages yet
                </p>
                <p className="text-[#E1B5EE]/40 text-sm mt-1">
                  Be the first to say hello!
                </p>
              </div>
            </div>
          )}

          {messages.map((msg: ChatMessage) => {
            const isOwn = msg.user_id === userId;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar for other users */}
                {!isOwn && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#BA7FCB] flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                )}

                <div
                  className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
                >
                  {/* Username label for others */}
                  {!isOwn && (
                    <span className="text-[#E1B5EE]/70 text-xs font-medium mb-1 ml-1">
                      {msg.username}
                    </span>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-md ${
                      isOwn
                        ? 'bg-[#BA7FCB] text-white rounded-br-md'
                        : 'bg-[#483285] text-white/95 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {msg.message}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span
                    className={`text-[10px] text-white/40 mt-1 ${isOwn ? 'mr-1 text-right' : 'ml-1'}`}
                  >
                    {formatTime(msg.created_at)}
                  </span>
                </div>

                {/* Avatar for own messages */}
                {isOwn && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E1B5EE] flex items-center justify-center text-[#462C90] text-sm font-bold shadow-md">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-[#241943] border-t border-[#483285]/50 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1 bg-white/10 border-none text-white placeholder:text-white/40 focus-visible:ring-[#BA7FCB] focus-visible:ring-1 rounded-full px-5 h-11"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || sending}
              size="icon"
              className="h-11 w-11 rounded-full bg-[#BA7FCB] hover:bg-[#E1B5EE] text-white hover:text-[#462C90] transition-all duration-200 shadow-lg disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
