import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/books?page=1&limit=50&genre=Fiction&q=search&sort=popular|newest|recent
 * Retrieves paginated books from the database with filtering and LRU popularity ordering.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const genre = searchParams.get('genre')?.trim();
    const q = searchParams.get('q')?.trim();
    const sort = searchParams.get('sort') || 'popular';

    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    if (genre) {
      whereCondition.genre = { contains: genre, mode: 'insensitive' };
    }

    if (q) {
      whereCondition.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
      ];
    }

    let orderByClause: any = { search_count: 'desc' };
    if (sort === 'newest') {
      orderByClause = { created_at: 'desc' };
    } else if (sort === 'recent') {
      orderByClause = { last_accessed_at: 'desc' };
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereCondition,
        orderBy: orderByClause,
        skip,
        take: limit,
      }),
      prisma.book.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books
 * Creates a new book entry in the catalogue. Requires name, author, genre, and image.
 * User-created books are automatically pinned (`is_pinned = true`) to protect them from LRU eviction.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, author, genre, image, description } = body;

    if (!name || !author || !genre || !image) {
      return NextResponse.json(
        { error: 'Fields name, author, genre, and image are required' },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        name,
        author,
        genre,
        image,
        description: description || null,
        is_pinned: true, // Protect custom user-created books from LRU eviction
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
