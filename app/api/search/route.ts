import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ─── In-memory LRU Cache ───────────────────────────────
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_SIZE = 100;

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  // Move to end (most recently used)
  cache.delete(key);
  cache.set(key, entry);
  return entry.data;
}

function setCached(key: string, data: unknown): void {
  // Evict oldest entry if at capacity
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── GET /api/search?q=...&type=all|books|users|blogs ──
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const type = searchParams.get('type') || 'all';

    if (!q) {
      return NextResponse.json(
        { error: 'Search query "q" is required' },
        { status: 400 }
      );
    }

    const cacheKey = `${q}-${type}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const searchBooks = type === 'all' || type === 'books';
    const searchUsers = type === 'all' || type === 'users';
    const searchBlogs = type === 'all' || type === 'blogs';

    const [books, users, blogs] = await Promise.all([
      searchBooks
        ? prisma.book.findMany({
            where: {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { author: { contains: q, mode: 'insensitive' } },
              ],
            },
            take: 20,
          })
        : [],
      searchUsers
        ? prisma.user.findMany({
            where: {
              username: { contains: q, mode: 'insensitive' },
            },
            select: {
              id: true,
              username: true,
              name: true,
              bio: true,
              genres: true,
            },
            take: 20,
          })
        : [],
      searchBlogs
        ? prisma.blogPost.findMany({
            where: {
              published: true,
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { content: { contains: q, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              title: true,
              excerpt: true,
              cover_image: true,
              created_at: true,
              author: {
                select: { id: true, username: true, name: true },
              },
            },
            take: 20,
          })
        : [],
    ]);

    const result = { books, users, blogs };
    setCached(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
