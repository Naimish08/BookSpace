'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/superbase/client';
import { useLiveChat, type ChatMessage } from '@/hooks/useLiveChat';
import { useDirectChat, type DirectMessage } from '@/hooks/useDirectChat';
import ConnectionPicker from '@/components/ConnectionPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  Loader2,
  MessageCircle,
  Users,
  MessageSquarePlus,
  ArrowLeft,
} from 'lucide-react';

// ─── Type Definitions ────────────────────────────────────────────

/** Represents a conversation item in the sidebar list */
interface ConversationItem {
  id: string;
  updatedAt: string;
  otherUser: {
    id: string;
    username: string | null;
    name: string | null;
  } | null;
  lastMessage: {
    text: string;
    timestamp: string;
    isOwn: boolean;
  } | null;
}

/** Chat view modes: community chat or direct messages */
type ChatView = 'community' | 'dm';

// ─── Main Chat Page Component ────────────────────────────────────

/**
 * ChatPage — Entry point with authentication guard.
 * Checks Supabase session and redirects to login if unauthenticated.
 */
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

  return <ChatLayout userId={userId} username={username} />;
}

// ─── Chat Layout (Two-Panel) ─────────────────────────────────────

/**
 * ChatLayout — Two-panel layout with sidebar and message area.
 * Manages state for: active view (community/dm), selected conversation,
 * conversation list, and the connection picker modal.
 */
function ChatLayout({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const [activeView, setActiveView] = useState<ChatView>('community');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ConversationItem['otherUser']>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // ─── Fetch conversation list ────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const res = await fetch(`/api/conversations?userId=${userId}`);
      if (res.ok) {
        const data: ConversationItem[] = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setConversationsLoading(false);
    }
  }, [userId]);

  // Load conversations when switching to DM view
  useEffect(() => {
    if (activeView === 'dm') {
      fetchConversations();
    }
  }, [activeView, fetchConversations]);

  // ─── Handle creating/opening a conversation ────────────────────
  async function handleSelectConnection(targetUserId: string) {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetUserId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedConversation(data.id);
        setSelectedUser(data.otherUser);
        setShowPicker(false);
        setShowSidebar(false);
        // Refresh conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  }

  // ─── Handle selecting an existing conversation ─────────────────
  function handleSelectConversation(conv: ConversationItem) {
    setSelectedConversation(conv.id);
    setSelectedUser(conv.otherUser);
    setShowSidebar(false);
  }

  // ─── Format timestamp for sidebar ──────────────────────────────
  function formatTimestamp(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="min-h-screen bg-[#FDE8BE] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] flex rounded-2xl overflow-hidden shadow-2xl border border-[#462C90]/20">

        {/* ─── Left Sidebar ─────────────────────────────────────── */}
        <div
          className={`${
            showSidebar ? 'flex' : 'hidden md:flex'
          } flex-col w-full md:w-80 bg-[#1a1035] border-r border-[#483285]/50 shrink-0`}
        >
          {/* Sidebar Header */}
          <div className="px-4 py-4 border-b border-[#483285]/50">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#E1B5EE]" />
              BookSpace Chat
            </h1>
          </div>

          {/* View Toggle Tabs */}
          <div className="flex border-b border-[#483285]/50">
            <button
              onClick={() => {
                setActiveView('community');
                setSelectedConversation(null);
                setSelectedUser(null);
                setShowSidebar(true);
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeView === 'community'
                  ? 'text-[#E1B5EE] border-b-2 border-[#BA7FCB] bg-white/5'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <Users className="h-4 w-4" />
              Community
            </button>
            <button
              onClick={() => {
                setActiveView('dm');
                setSelectedConversation(null);
                setSelectedUser(null);
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeView === 'dm'
                  ? 'text-[#E1B5EE] border-b-2 border-[#BA7FCB] bg-white/5'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              Direct Messages
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {activeView === 'community' ? (
              /* Community view — just a note explaining it's on the right */
              <div className="p-4 text-center">
                <div className="mt-8">
                  <Users className="h-12 w-12 text-[#BA7FCB]/40 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">
                    Community chat is live!
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Chat with all BookSpace members
                  </p>
                  {/* Mobile: show chat button */}
                  <Button
                    onClick={() => setShowSidebar(false)}
                    className="mt-4 md:hidden bg-[#BA7FCB] hover:bg-[#E1B5EE] text-white hover:text-[#462C90] rounded-lg"
                  >
                    Open Chat →
                  </Button>
                </div>
              </div>
            ) : (
              /* DM view — conversation list */
              <div>
                {conversationsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-[#BA7FCB]" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center mt-8">
                    <MessageCircle className="h-12 w-12 text-[#BA7FCB]/40 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">No conversations yet</p>
                    <p className="text-white/40 text-xs mt-1">
                      Start a chat with your connections
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left ${
                        selectedConversation === conv.id
                          ? 'bg-white/10 border-l-2 border-[#BA7FCB]'
                          : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#BA7FCB] flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {(
                          conv.otherUser?.username ||
                          conv.otherUser?.name ||
                          '?'
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* Name & Last Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium truncate text-sm">
                            {conv.otherUser?.name ||
                              conv.otherUser?.username ||
                              'Unknown'}
                          </p>
                          {conv.lastMessage && (
                            <span className="text-white/40 text-xs shrink-0 ml-2">
                              {formatTimestamp(conv.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className="text-white/50 text-xs truncate mt-0.5">
                            {conv.lastMessage.isOwn ? 'You: ' : ''}
                            {conv.lastMessage.text}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* New Chat Button (DM view only) */}
          {activeView === 'dm' && (
            <div className="p-3 border-t border-[#483285]/50">
              <Button
                onClick={() => setShowPicker(true)}
                className="w-full bg-[#BA7FCB] hover:bg-[#E1B5EE] text-white hover:text-[#462C90] rounded-lg flex items-center gap-2"
              >
                <MessageSquarePlus className="h-4 w-4" />
                New Chat
              </Button>
            </div>
          )}
        </div>

        {/* ─── Right Panel (Message Area) ───────────────────────── */}
        <div
          className={`${
            showSidebar ? 'hidden md:flex' : 'flex'
          } flex-col flex-1 min-w-0`}
        >
          {activeView === 'community' ? (
            <CommunityChat
              userId={userId}
              username={username}
              onBack={() => setShowSidebar(true)}
              showBackButton={!showSidebar}
            />
          ) : selectedConversation && selectedUser ? (
            <DMChat
              conversationId={selectedConversation}
              userId={userId}
              username={username}
              otherUser={selectedUser}
              onBack={() => {
                setShowSidebar(true);
                setSelectedConversation(null);
                setSelectedUser(null);
              }}
              showBackButton={!showSidebar}
              onMessageSent={fetchConversations}
            />
          ) : (
            /* No conversation selected */
            <div className="flex-1 bg-gradient-to-b from-[#462C90] to-[#241943] flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-[#BA7FCB]/30 mx-auto mb-4" />
                <p className="text-[#E1B5EE]/60 text-lg font-medium">
                  Select a conversation
                </p>
                <p className="text-[#E1B5EE]/40 text-sm mt-1">
                  Or start a new chat with your connections
                </p>
                {/* Mobile: back button */}
                <Button
                  onClick={() => setShowSidebar(true)}
                  variant="ghost"
                  className="mt-4 md:hidden text-white/60 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to conversations
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Connection Picker Modal ──────────────────────────── */}
      <ConnectionPicker
        userId={userId}
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelectConnection={handleSelectConnection}
      />
    </div>
  );
}

// ─── Community Chat Panel ────────────────────────────────────────

/**
 * CommunityChat — Renders the existing community chat experience
 * within the right panel. Uses the useLiveChat hook unchanged.
 */
function CommunityChat({
  userId,
  username,
  onBack,
  showBackButton,
}: {
  userId: string;
  username: string;
  onBack: () => void;
  showBackButton: boolean;
}) {
  const { messages, onlineCount, sendMessage, loading } = useLiveChat(
    userId,
    username
  );
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#462C90] to-[#483285] px-4 md:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button onClick={onBack} className="text-white/70 hover:text-white mr-1">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <MessageCircle className="h-5 w-5 text-[#E1B5EE]" />
          <h2 className="text-lg font-bold text-white">
            💬 Community Chat
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-white/90 font-medium">
            {onlineCount} online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#462C90] to-[#241943] px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-[#BA7FCB]" />
          </div>
        ) : messages.length === 0 ? (
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
        ) : (
          messages.map((msg: ChatMessage) => {
            const isOwn = msg.user_id === userId;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwn && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#BA7FCB] flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {msg.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isOwn && (
                    <span className="text-[#E1B5EE]/70 text-xs font-medium mb-1 ml-1">
                      {msg.username}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl shadow-md ${
                      isOwn
                        ? 'bg-[#BA7FCB] text-white rounded-br-md'
                        : 'bg-[#483285] text-white/95 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                  </div>
                  <span
                    className={`text-[10px] text-white/40 mt-1 ${isOwn ? 'mr-1 text-right' : 'ml-1'}`}
                  >
                    {formatTime(msg.created_at)}
                  </span>
                </div>
                {isOwn && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E1B5EE] flex items-center justify-center text-[#462C90] text-sm font-bold shadow-md">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}
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
    </>
  );
}

// ─── Direct Message Chat Panel ───────────────────────────────────

/**
 * DMChat — Renders a private 1:1 conversation using the useDirectChat hook.
 * Same message bubble styling as CommunityChat for visual consistency.
 */
function DMChat({
  conversationId,
  userId,
  username,
  otherUser,
  onBack,
  showBackButton,
  onMessageSent,
}: {
  conversationId: string;
  userId: string;
  username: string;
  otherUser: { id: string; username: string | null; name: string | null };
  onBack: () => void;
  showBackButton: boolean;
  onMessageSent: () => void;
}) {
  const { messages, sendMessage, loading } = useDirectChat(
    conversationId,
    userId,
    username
  );
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!inputValue.trim() || sending) return;
    setSending(true);
    await sendMessage(inputValue);
    setInputValue('');
    setSending(false);
    // Refresh conversation list to update last message preview
    onMessageSent();
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

  const otherDisplayName = otherUser.name || otherUser.username || 'Unknown';
  const otherInitial = otherDisplayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#462C90] to-[#483285] px-4 md:px-6 py-4 flex items-center gap-3 shrink-0">
        {showBackButton && (
          <button onClick={onBack} className="text-white/70 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#BA7FCB] flex items-center justify-center text-white text-sm font-bold shadow-md">
          {otherInitial}
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{otherDisplayName}</h2>
          {otherUser.username && (
            <p className="text-xs text-white/50">@{otherUser.username}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#462C90] to-[#241943] px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-[#BA7FCB]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#BA7FCB]/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#BA7FCB]/60">
                  {otherInitial}
                </span>
              </div>
              <p className="text-[#E1B5EE]/60 text-lg font-medium">
                Start your conversation
              </p>
              <p className="text-[#E1B5EE]/40 text-sm mt-1">
                Say hello to {otherDisplayName}! 👋
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg: DirectMessage) => {
            const isOwn = msg.sender_id === userId;
            const senderName =
              msg.sender?.username || msg.sender?.name || 'Unknown';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {/* Other user's avatar */}
                {!isOwn && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#BA7FCB] flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {otherInitial}
                  </div>
                )}

                <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
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

                {/* Own avatar */}
                {isOwn && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E1B5EE] flex items-center justify-center text-[#462C90] text-sm font-bold shadow-md">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-[#241943] border-t border-[#483285]/50 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${otherDisplayName}...`}
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
    </>
  );
}
