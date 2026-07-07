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

// ─── Streak computation ────────────────────────────────
function computeCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const lastDate = sorted[sorted.length - 1];
  if (lastDate !== today && lastDate !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = sorted.length - 2; i >= 0; i--) {
    const current = new Date(sorted[i + 1]);
    const prev = new Date(sorted[i]);
    const diffDays = Math.round(
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ─── POST /api/badges/check ────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Fetch all data needed for milestone checks in parallel
    const [
      completedBooksCount,
      publishedBlogsCount,
      eventParticipationsCount,
      profile,
      existingBadges,
    ] = await Promise.all([
      prisma.bookDiary.count({
        where: {
          user_id: userId,
          end_date: { not: null },
        },
      }),
      prisma.blogPost.count({
        where: {
          author_id: userId,
          published: true,
        },
      }),
      prisma.eventParticipation.count({
        where: { user_id: userId },
      }),
      prisma.bookspaceProfile.findUnique({
        where: { user_id: userId },
      }),
      prisma.badge.findMany({
        where: { user_id: userId },
      }),
    ]);

    const existingBadgeNames = new Set(existingBadges.map((b) => b.name));

    // Compute streak from profile
    let currentStreak = 0;
    if (
      profile?.streak_calendar &&
      typeof profile.streak_calendar === 'object' &&
      'dates' in profile.streak_calendar &&
      Array.isArray((profile.streak_calendar as { dates: string[] }).dates)
    ) {
      currentStreak = computeCurrentStreak(
        (profile.streak_calendar as { dates: string[] }).dates
      );
    }

    const connectionCount = profile?.connection?.length ?? 0;

    // Define milestone conditions
    const milestoneChecks: { name: string; earned: boolean }[] = [
      { name: '📚 First Read', earned: completedBooksCount >= 1 },
      { name: '🔥 Streak Master', earned: currentStreak >= 7 },
      { name: '⭐ Bookworm', earned: completedBooksCount >= 5 },
      { name: '🏆 Bibliophile', earned: completedBooksCount >= 10 },
      { name: '✍️ First Blog', earned: publishedBlogsCount >= 1 },
      { name: '🤝 Social Reader', earned: connectionCount >= 5 },
      { name: '📅 Event Explorer', earned: eventParticipationsCount >= 1 },
    ];

    // Award new badges
    const newBadges: { name: string; awarded_on: Date }[] = [];
    const now = new Date();

    for (const check of milestoneChecks) {
      if (check.earned && !existingBadgeNames.has(check.name)) {
        await prisma.badge.create({
          data: {
            user_id: userId,
            name: check.name,
            awarded_on: now,
          },
        });
        newBadges.push({ name: check.name, awarded_on: now });
      }
    }

    // Build allBadges response with updated earned status
    const updatedEarnedNames = new Set([
      ...existingBadgeNames,
      ...newBadges.map((b) => b.name),
    ]);

    const allBadges = POSSIBLE_BADGES.map((badge) => ({
      ...badge,
      earned: updatedEarnedNames.has(badge.name),
    }));

    return NextResponse.json({ newBadges, allBadges });
  } catch (error) {
    console.error('Badge check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
