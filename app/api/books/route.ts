import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ─── GET /api/books ─────────────────────────────────────
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ─── POST /api/books ────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, author, genre, image } = body;

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
