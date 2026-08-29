import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { searchOpenLibrary, ExternalBook } from '@/lib/book-api';
import { touchBooks } from '@/lib/lru-book-cache';

/**
 * Cache entry structure for search caching (No TTL / time expiration).
 */
interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory cache configuration (No TTL / time-based eviction)
const cache = new Map<string, CacheEntry>();
const CACHE_MAX_SIZE = 500;

/**
 * Retrieves a cached search result (No TTL expiration).
 */
function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  // Refresh position in Map without deleting due to time
  cache.delete(key);
  cache.set(key, entry);
  return entry.data;
}

/**
 * Stores a search response in in-memory cache.
 */
function setCached(key: string, data: unknown): void {
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) {
      cache.delete(oldestKey);
    }
  }
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Performs hybrid book search:
 * 1. Queries local DB
 * 2. If < 10 results, queries Open Library API
 * 3. Persists/upserts newly discovered books into DB permanently
 * 4. Touches accessed books to track access count & popularity
 */
async function performHybridBookSearch(q: string) {
  // Step 1: Query local DB first
  const localBooks = await prisma.book.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
        { genre: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 20,
    orderBy: { search_count: 'desc' },
  });

  let allBooks = [...localBooks];

  // Step 2: If insufficient results found locally, query Open Library API
  if (localBooks.length < 10) {
    const externalBooks: ExternalBook[] = await searchOpenLibrary(q, 15);

    if (externalBooks.length > 0) {
      // Step 3: Upsert newly discovered books into database permanently
      const upsertedBooks = await Promise.all(
        externalBooks.map(async (extBook) => {
          try {
            return await prisma.book.upsert({
              where: { external_id: extBook.external_id },
              update: {
                last_accessed_at: new Date(),
                search_count: { increment: 1 },
              },
              create: {
                external_id: extBook.external_id,
                name: extBook.name,
                author: extBook.author,
                genre: extBook.genre,
                image: extBook.image,
                description: extBook.description,
                last_accessed_at: new Date(),
                search_count: 1,
              },
            });
          } catch (e) {
            // Fallback for duplicates by name & author if external_id missing
            const existingByName = await prisma.book.findFirst({
              where: { name: extBook.name, author: extBook.author },
            });
            if (existingByName) return existingByName;
            return null;
          }
        })
      );

      const validUpserts = upsertedBooks.filter(Boolean) as typeof localBooks;

      // Merge and deduplicate by ID
      const bookMap = new Map();
      for (const b of [...localBooks, ...validUpserts]) {
        if (b) bookMap.set(b.id, b);
      }
      allBooks = Array.from(bookMap.values()).slice(0, 20);
    }
  }

  // Step 4: Touch accessed book IDs for access tracking
  if (allBooks.length > 0) {
    const bookIds = allBooks.map((b) => b.id);
    touchBooks(bookIds).catch((err) => console.error('Touch books error:', err));
  }

  return allBooks;
}

/**
 * GET /api/search?q=...&type=all|books|users|blogs
 * Performs global case-insensitive search with Hybrid Open Library fallback.
 * Permanent database storage with no automatic TTL eviction.
 */
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
      searchBooks ? performHybridBookSearch(q) : [],
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
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
