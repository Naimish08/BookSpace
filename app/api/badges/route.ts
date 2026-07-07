import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ─── All possible badges ───────────────────────────────
const POSSIBLE_BADGES = [
  { name: '📚 First Read', description: 'Complete your first book' },
  { name: '🔥 Streak Master', description: '7-day reading streak' },
  { name: '⭐ Bookworm', description: 'Complete 5 books' },
  { name: '🏆 Bibliophile', description: 'Complete 10 books' },
  { name: '✍️ First Blog', description: 'Publish your first blog post' },
  { name: '🤝 Social Reader', description: 'Make 5 connections' },
  { name: '📅 Event Explorer', description: 'Participate in an event' },
];

// ─── GET /api/badges?userId=... ─────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userBadges = await prisma.badge.findMany({
      where: { user_id: userId },
      orderBy: { awarded_on: 'desc' },
    });

    const earnedNames = new Set(userBadges.map((b) => b.name));

    const allBadges = POSSIBLE_BADGES.map((badge) => ({
      ...badge,
      earned: earnedNames.has(badge.name),
      awarded_on:
        userBadges.find((b) => b.name === badge.name)?.awarded_on ?? null,
    }));

    return NextResponse.json({ badges: userBadges, allBadges });
  } catch (error) {
    console.error('Badges GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
