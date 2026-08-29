/**
 * lib/lru-book-cache.ts
 * Database-level Least Recently Used (LRU) Access Tracker for BookSpace.
 * Eviction is disabled (TTL / auto-eviction removed).
 */

import { prisma } from '@/lib/prisma';

// Set DB cache limit to infinity so no books are ever removed automatically
export const MAX_DB_BOOKS_LIMIT = Number.MAX_SAFE_INTEGER;

/**
 * Batch updates `last_accessed_at` timestamp and increments `search_count`
 * for a list of accessed book IDs.
 */
export async function touchBooks(bookIds: string[]): Promise<void> {
  if (!bookIds || bookIds.length === 0) return;

  try {
    const now = new Date();
    await prisma.book.updateMany({
      where: {
        id: { in: bookIds },
      },
      data: {
        last_accessed_at: now,
        search_count: { increment: 1 },
      },
    });
  } catch (error) {
    console.error('Error in touchBooks:', error);
  }
}

/**
 * LRU Cache Eviction (Disabled):
 * Auto-eviction is completely disabled so no book records in the database are purged.
 */
export async function evictStaleBooks(maxLimit = MAX_DB_BOOKS_LIMIT): Promise<{ evictedCount: number; totalRemaining: number }> {
  try {
    const totalBooks = await prisma.book.count();
    // Auto-eviction disabled
    return { evictedCount: 0, totalRemaining: totalBooks };
  } catch (error) {
    console.error('Error in evictStaleBooks:', error);
    return { evictedCount: 0, totalRemaining: 0 };
  }
}
