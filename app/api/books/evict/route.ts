import { NextRequest, NextResponse } from 'next/server';
import { evictStaleBooks, MAX_DB_BOOKS_LIMIT } from '@/lib/lru-book-cache';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/books/evict
 * Returns current database book count and LRU cache statistics.
 */
export async function GET() {
  try {
    const [totalBooks, pinnedBooks, referencedCount] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { is_pinned: true } }),
      prisma.book.count({
        where: {
          OR: [
            { wishlists: { some: {} } },
            { bookDiaries: { some: {} } },
            { bookExchanges: { some: {} } },
            { monthlyReads: { some: {} } },
            { BookspaceProfile: { some: {} } },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      totalBooks,
      pinnedBooks,
      referencedBooks: referencedCount,
      maxLimit: MAX_DB_BOOKS_LIMIT,
      status: totalBooks > MAX_DB_BOOKS_LIMIT ? 'over_capacity' : 'healthy',
    });
  } catch (error) {
    console.error('Error fetching LRU stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books/evict
 * Triggers LRU eviction to purge stale, unreferenced cached books.
 * Optional body: { maxLimit: number }
 */
export async function POST(request: NextRequest) {
  try {
    let limit = MAX_DB_BOOKS_LIMIT;
    try {
      const body = await request.json();
      if (body.maxLimit && typeof body.maxLimit === 'number') {
        limit = body.maxLimit;
      }
    } catch {
      // Body empty/optional
    }

    const result = await evictStaleBooks(limit);

    return NextResponse.json({
      success: true,
      message: `Eviction completed. Purged ${result.evictedCount} stale records.`,
      stats: result,
    });
  } catch (error) {
    console.error('Eviction API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
