import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/suggestions
 * Fetches all user contact suggestions and feedback ideas.
 */
export async function GET() {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: { id: 'desc' },
      take: 50,
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Suggestions GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/suggestions
 * Saves a new suggestion, contact message, or feedback idea to the database.
 * Request body: { name: string, email: string, contactNo?: string, idea: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, contactNo, idea } = body;

    if (!name || !email || !idea) {
      return NextResponse.json(
        { error: 'name, email, and idea (message) are required' },
        { status: 400 }
      );
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        name,
        email,
        contact_no: contactNo || '',
        idea,
      },
    });

    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    console.error('Suggestions POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
