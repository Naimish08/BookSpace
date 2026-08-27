import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/exchanges?userId=<uuid>
 * Fetches book exchange listings and requests.
 * If userId is passed, fetches exchanges by that user.
 * Otherwise, fetches all available "pending" book exchanges.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const whereCondition = userId ? { user_id: userId } : { status: 'pending' };

    const exchanges = await prisma.bookExchange.findMany({
      where: whereCondition,
      include: {
        book: true,
        user: {
          select: { id: true, username: true, name: true },
        },
      },
      orderBy: { id: 'desc' },
      take: 50,
    });

    return NextResponse.json(exchanges);
  } catch (error) {
    console.error('Exchanges GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/exchanges
 * Offers a book for exchange.
 * Body: { userId: string, bookId: string, feedback?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, bookId, feedback } = body;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: 'userId and bookId are required' },
        { status: 400 }
      );
    }

    const exchange = await prisma.bookExchange.create({
      data: {
        user_id: userId,
        book_id: bookId,
        feedback: feedback || 'Looking to exchange this book with fellow readers!',
        status: 'pending',
      },
      include: {
        book: true,
        user: {
          select: { id: true, username: true, name: true },
        },
      },
    });

    return NextResponse.json(exchange, { status: 201 });
  } catch (error) {
    console.error('Exchanges POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/exchanges
 * Updates an exchange status (e.g. "accepted", "completed", "cancelled").
 * Body: { exchangeId: string, status: string }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { exchangeId, status } = body;

    if (!exchangeId || !status) {
      return NextResponse.json(
        { error: 'exchangeId and status are required' },
        { status: 400 }
      );
    }

    const updated = await prisma.bookExchange.update({
      where: { id: exchangeId },
      data: { status },
      include: {
        book: true,
        user: { select: { id: true, username: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Exchanges PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
