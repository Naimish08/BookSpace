'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/superbase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Book {
  id: string;
  name: string;
  author: string;
  genre: string;
  image: string;
  created_at: string;
}

export function useRealtimeBooks(initialBooks: Book[]) {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  useEffect(() => {
    setBooks(initialBooks);
  }, [initialBooks]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('realtime-books')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Book' },
        (payload: RealtimePostgresChangesPayload<Book>) => {
          switch (payload.eventType) {
            case 'INSERT': {
              const newBook = payload.new as Book;
              setBooks((prev) => {
                const exists = prev.some((b) => b.id === newBook.id);
                if (exists) return prev;
                return [...prev, newBook];
              });
              break;
            }
            case 'UPDATE': {
              const updatedBook = payload.new as Book;
              setBooks((prev) =>
                prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
              );
              break;
            }
            case 'DELETE': {
              const deletedBook = payload.old as Partial<Book>;
              if (deletedBook.id) {
                setBooks((prev) => prev.filter((b) => b.id !== deletedBook.id));
              }
              break;
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return books;
}
