import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/conversations?userId=<uuid>
 * Fetches all conversations for the given user, including:
 * - The other participant's profile (id, username, name)
 * - The last message preview and timestamp
 * Sorted by most recently updated first.
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

    // Find all conversations where the user is a participant
    const participations = await prisma.conversationParticipant.findMany({
      where: { user_id: userId },
      select: { conversation_id: true },
    });

    if (participations.length === 0) {
      return NextResponse.json([]);
    }

    const conversationIds = participations.map((p) => p.conversation_id);

    // Fetch full conversation data with participants and last message
    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, name: true },
            },
          },
        },
        messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: {
            message: true,
            created_at: true,
            sender_id: true,
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    // Transform response: extract the "other" participant and last message
    const result = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p.user_id !== userId
      );
      const lastMessage = conv.messages[0] || null;

      return {
        id: conv.id,
        updatedAt: conv.updated_at,
        otherUser: otherParticipant?.user || null,
        lastMessage: lastMessage
          ? {
              text: lastMessage.message,
              timestamp: lastMessage.created_at,
              isOwn: lastMessage.sender_id === userId,
            }
          : null,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Conversations GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Creates a new conversation between two users, or returns an existing one.
 * Validates that both users are mutually connected via BookspaceProfile.connection.
 *
 * Request body: { userId: string, targetUserId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, targetUserId } = body;

    if (!userId || !targetUserId) {
      return NextResponse.json(
        { error: 'userId and targetUserId are required' },
        { status: 400 }
      );
    }

    if (userId === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot create a conversation with yourself' },
        { status: 400 }
      );
    }

    // Validate mutual connection
    const userProfile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: userId },
      select: { connection: true },
    });

    if (!userProfile || !userProfile.connection.includes(targetUserId)) {
      return NextResponse.json(
        { error: 'You can only message users in your connections' },
        { status: 403 }
      );
    }

    // Check if a conversation already exists between these two users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { user_id: userId } } },
          { participants: { some: { user_id: targetUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, name: true },
            },
          },
        },
      },
    });

    if (existingConversation) {
      const otherUser = existingConversation.participants.find(
        (p) => p.user_id !== userId
      );
      return NextResponse.json({
        id: existingConversation.id,
        otherUser: otherUser?.user || null,
        isExisting: true,
      });
    }

    // Create new conversation with both participants
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { user_id: userId },
            { user_id: targetUserId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, name: true },
            },
          },
        },
      },
    });

    const otherUser = conversation.participants.find(
      (p) => p.user_id !== userId
    );

    return NextResponse.json(
      {
        id: conversation.id,
        otherUser: otherUser?.user || null,
        isExisting: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Conversations POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
