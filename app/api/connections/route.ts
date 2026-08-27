import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/connections?userId=<uuid>
 * Resolves the user's BookspaceProfile.connection UUID array into full user records.
 * Returns an array of connected users with their id, username, and name.
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

    // Fetch the user's BookspaceProfile to get connection UUIDs
    const profile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: userId },
      select: { connection: true },
    });

    if (!profile || !profile.connection.length) {
      return NextResponse.json([]);
    }

    // Resolve connection UUIDs to full user records
    const connections = await prisma.user.findMany({
      where: { id: { in: profile.connection } },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    return NextResponse.json(connections);
  } catch (error) {
    console.error('Connections GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/connections
 * Adds a target user to the requesting user's connections array.
 * Creates the BookspaceProfile if it doesn't exist yet.
 * Body: { userId: string, targetUserId: string }
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
        { error: 'Cannot connect with yourself' },
        { status: 400 }
      );
    }

    // Fetch or create profile for user
    let profile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      profile = await prisma.bookspaceProfile.create({
        data: {
          user_id: userId,
          bio: '',
          connection: [targetUserId],
        },
      });
    } else if (!profile.connection.includes(targetUserId)) {
      profile = await prisma.bookspaceProfile.update({
        where: { user_id: userId },
        data: {
          connection: { push: targetUserId },
        },
      });
    }

    // Also update target user's profile to make connection mutual if desired
    let targetProfile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: targetUserId },
    });
    if (!targetProfile) {
      await prisma.bookspaceProfile.create({
        data: {
          user_id: targetUserId,
          bio: '',
          connection: [userId],
        },
      });
    } else if (!targetProfile.connection.includes(userId)) {
      await prisma.bookspaceProfile.update({
        where: { user_id: targetUserId },
        data: {
          connection: { push: userId },
        },
      });
    }

    return NextResponse.json({
      success: true,
      isConnected: true,
      connectionsCount: profile.connection.length,
    });
  } catch (error) {
    console.error('Connections POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/connections
 * Removes a target user from the requesting user's connections array.
 * Body: { userId: string, targetUserId: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, targetUserId } = body;

    if (!userId || !targetUserId) {
      return NextResponse.json(
        { error: 'userId and targetUserId are required' },
        { status: 400 }
      );
    }

    const profile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: userId },
    });

    if (profile && profile.connection.includes(targetUserId)) {
      const updatedConnections = profile.connection.filter((id) => id !== targetUserId);
      await prisma.bookspaceProfile.update({
        where: { user_id: userId },
        data: {
          connection: updatedConnections,
        },
      });
    }

    // Also remove from target user's connections array
    const targetProfile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: targetUserId },
    });

    if (targetProfile && targetProfile.connection.includes(userId)) {
      const updatedTargetConnections = targetProfile.connection.filter((id) => id !== userId);
      await prisma.bookspaceProfile.update({
        where: { user_id: targetUserId },
        data: {
          connection: updatedTargetConnections,
        },
      });
    }

    return NextResponse.json({
      success: true,
      isConnected: false,
    });
  } catch (error) {
    console.error('Connections DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
