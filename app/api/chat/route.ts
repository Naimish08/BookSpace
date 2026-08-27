import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/chat
 * Retrieves the latest 50 community chat messages ordered chronologically.
 */
export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    // Reverse array so oldest messages appear first in chat history
    messages.reverse();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat
 * Broadcasts a new chat message from an authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, username, message } = body;

    if (!userId || !username || !message) {
      return NextResponse.json(
        { error: 'userId, username, and message are required' },
        { status: 400 }
      );
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        user_id: userId,
        username,
        message,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(chatMessage, { status: 201 });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

