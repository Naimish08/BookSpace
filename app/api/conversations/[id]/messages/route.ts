import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/conversations/:id/messages?userId=<uuid>
 * Fetches the latest 50 messages for a conversation.
 * Validates that the requesting user is a participant.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    // Verify the user is a participant in this conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: userId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'You are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Fetch latest 50 messages in chronological order
    const messages = await prisma.directMessage.findMany({
      where: { conversation_id: conversationId },
      orderBy: { created_at: 'desc' },
      take: 50,
      include: {
        sender: {
          select: { id: true, username: true, name: true },
        },
      },
    });

    // Reverse to show oldest first
    messages.reverse();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('DM Messages GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations/:id/messages
 * Sends a new direct message in a conversation.
 * Validates the sender is a participant and updates Conversation.updated_at.
 *
 * Request body: { senderId: string, message: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const body = await request.json();
    const { senderId, message } = body;

    if (!senderId || !message) {
      return NextResponse.json(
        { error: 'senderId and message are required' },
        { status: 400 }
      );
    }

    // Verify the sender is a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id: conversationId,
          user_id: senderId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'You are not a participant in this conversation' },
        { status: 403 }
      );
    }

    // Create the message and update conversation timestamp in a transaction
    const [directMessage] = await prisma.$transaction([
      prisma.directMessage.create({
        data: {
          conversation_id: conversationId,
          sender_id: senderId,
          message: message.trim(),
        },
        include: {
          sender: {
            select: { id: true, username: true, name: true },
          },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updated_at: new Date() },
      }),
    ]);

    return NextResponse.json(directMessage, { status: 201 });
  } catch (error) {
    console.error('DM Messages POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
