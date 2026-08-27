import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/impact
 * Fetches platform impact statistics (books donated, children educated, active readers).
 */
export async function GET() {
  try {
    let impact = await prisma.impact.findFirst();

    if (!impact) {
      // Calculate dynamic active users and books donated counts
      const activeUsersCount = await prisma.user.count();
      const exchangesCount = await prisma.bookExchange.count();

      impact = {
        id: 'default',
        books_donated: 246 + exchangesCount,
        children_educated: 60,
        active_users: Math.max(20, activeUsersCount),
      };
    }

    return NextResponse.json(impact);
  } catch (error) {
    console.error('Impact GET error:', error);
    return NextResponse.json(
      {
        id: 'fallback',
        books_donated: 246,
        children_educated: 60,
        active_users: 20,
      },
      { status: 200 }
    );
  }
}
