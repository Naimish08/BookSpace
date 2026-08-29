import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/book-diary?userId=<uuid>
 * Fetches all reading diary entries for a user with full book details.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const diaryEntries = await prisma.bookDiary.findMany({
      where: { user_id: userId },
      include: {
        book: true,
      },
      orderBy: { start_date: 'desc' },
    });

    return NextResponse.json(diaryEntries);
  } catch (error) {
    console.error('BookDiary GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/book-diary
 * Creates a new reading diary entry for a user.
 * If bookId is provided, links to existing book.
 * If title/author are provided instead, finds or creates the book first.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      bookId,
      title,
      author,
      genre,
      type = 'reading',
      startDate,
      endDate,
      description,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    let targetBookId = bookId;

    // If no bookId was provided, search by title or create a new Book record
    if (!targetBookId && title) {
      const existingBook = await prisma.book.findFirst({
        where: { name: { equals: title, mode: 'insensitive' } },
      });

      if (existingBook) {
        targetBookId = existingBook.id;
      } else {
        const newBook = await prisma.book.create({
          data: {
            name: title,
            author: author || 'Unknown Author',
            genre: genre || 'Fiction',
            image: 'https://covers.openlibrary.org/b/id/10521270-L.jpg',
          },
        });
        targetBookId = newBook.id;
      }
    }

    if (!targetBookId) {
      return NextResponse.json(
        { error: 'Either bookId or book title is required' },
        { status: 400 }
      );
    }

    // Create the BookDiary record
    const entry = await prisma.bookDiary.create({
      data: {
        user_id: userId,
        book_id: targetBookId,
        type: type, // 'reading' | 'finished' | 'wishlist'
        start_date: startDate ? new Date(startDate) : new Date(),
        end_date: endDate ? new Date(endDate) : null,
        description: description || null,
      },
      include: {
        book: true,
      },
    });

    // If type is 'reading', update user's current_read in BookspaceProfile
    if (type === 'reading') {
      await prisma.bookspaceProfile.upsert({
        where: { user_id: userId },
        update: { current_read: targetBookId },
        create: {
          user_id: userId,
          bio: '',
          current_read: targetBookId,
          connection: [],
        },
      });
    }

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('BookDiary POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/book-diary?id=<uuid>&userId=<uuid>
 * Deletes a book diary entry.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId query parameters are required' },
        { status: 400 }
      );
    }

    const entry = await prisma.bookDiary.findUnique({
      where: { id },
    });

    if (!entry || entry.user_id !== userId) {
      return NextResponse.json(
        { error: 'Diary entry not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.bookDiary.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('BookDiary DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
