'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, MessageSquarePlus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Shape of a connection user record returned by /api/connections.
 */
interface ConnectionUser {
  id: string;
  username: string | null;
  name: string | null;
}

interface ConnectionPickerProps {
  /** The authenticated user's UUID */
  userId: string;
  /** Whether the picker modal is open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Callback when a connection is selected to start/open a DM */
  onSelectConnection: (targetUserId: string) => void;
}

/**
 * ConnectionPicker — Modal component for selecting a connection to start a new DM.
 *
 * Fetches the user's connections from `/api/connections` and presents a
 * searchable list with avatar initials, names, and usernames.
 * On selection, triggers the parent to create/open a conversation.
 */
export default function ConnectionPicker({
  userId,
  isOpen,
  onClose,
  onSelectConnection,
}: ConnectionPickerProps) {
  const [connections, setConnections] = useState<ConnectionUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState<string | null>(null);

  // ─── Fetch connections when picker opens ────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    async function fetchConnections() {
      setLoading(true);
      try {
        const res = await fetch(`/api/connections?userId=${userId}`);
        if (res.ok) {
          const data: ConnectionUser[] = await res.json();
          setConnections(data);
        }
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchConnections();
    setSearchQuery('');
    setSelecting(null);
  }, [isOpen, userId]);

  // ─── Filter connections by search query ─────────────────────────
  const filteredConnections = useMemo(() => {
    if (!searchQuery.trim()) return connections;
    const q = searchQuery.toLowerCase();
    return connections.filter(
      (c) =>
        c.username?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q)
    );
  }, [connections, searchQuery]);

  // ─── Handle selecting a connection ──────────────────────────────
  async function handleSelect(targetUserId: string) {
    setSelecting(targetUserId);
    onSelectConnection(targetUserId);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-[#241943] rounded-2xl border border-[#483285]/50 shadow-2xl overflow-hidden">
        {/* ─── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#483285]/50">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-[#E1B5EE]" />
            <h2 className="text-lg font-semibold text-white">New Message</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ─── Search Bar ─────────────────────────────────────── */}
        <div className="px-5 py-3 border-b border-[#483285]/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections..."
              className="pl-9 bg-white/10 border-none text-white placeholder:text-white/40 focus-visible:ring-[#BA7FCB] focus-visible:ring-1 rounded-lg h-10"
            />
          </div>
        </div>

        {/* ─── Connections List ────────────────────────────────── */}
        <div className="max-h-72 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#BA7FCB]" />
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="text-center py-12 px-5">
              <p className="text-white/50 text-sm">
                {connections.length === 0
                  ? 'No connections yet. Connect with readers on their profiles!'
                  : 'No matching connections found.'}
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredConnections.map((connection) => (
                <button
                  key={connection.id}
                  onClick={() => handleSelect(connection.id)}
                  disabled={selecting === connection.id}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left disabled:opacity-50"
                >
                  {/* Avatar Initial */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#BA7FCB] flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {(connection.username || connection.name || '?')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* Name & Username */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {connection.name || connection.username || 'Unknown'}
                    </p>
                    {connection.username && (
                      <p className="text-white/50 text-sm truncate">
                        @{connection.username}
                      </p>
                    )}
                  </div>

                  {/* Loading indicator for selected */}
                  {selecting === connection.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-[#BA7FCB]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <div className="px-5 py-3 border-t border-[#483285]/30">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-white/60 hover:text-white hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
