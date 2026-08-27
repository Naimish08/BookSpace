import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Returns today's ISO date string formatted as YYYY-MM-DD.
 */
function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Computes consecutive active reading days count given an array of date strings.
 */
function computeCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort();
  const today = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const lastDate = sorted[sorted.length - 1];

  // Streak only counts if the last date recorded is today or yesterday
  if (lastDate !== today && lastDate !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  for (let i = sorted.length - 2; i >= 0; i--) {
    const current = new Date(sorted[i + 1]);
    const prev = new Date(sorted[i]);
    const diffMs = current.getTime() - prev.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Safely parses the streak_calendar JSON field into a date string array.
 */
function parseDates(streakCalendar: unknown): string[] {
  if (
    streakCalendar &&
    typeof streakCalendar === 'object' &&
    'dates' in streakCalendar &&
    Array.isArray((streakCalendar as { dates: string[] }).dates)
  ) {
    return (streakCalendar as { dates: string[] }).dates;
  }
  return [];
}

/**
 * GET /api/streak?userId=...
 * Calculates current reading streak and returns activity calendar dates for a user.
 */
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

    const profile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      return NextResponse.json({
        currentStreak: 0,
        dates: [],
        totalDays: 0,
      });
    }

    const dates = parseDates(profile.streak_calendar);
    const currentStreak = computeCurrentStreak(dates);

    return NextResponse.json({
      currentStreak,
      dates,
      totalDays: dates.length,
    });
  } catch (error) {
    console.error('Streak GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/streak
 * Records today as an active reading day for the user and updates their streak calculation.
 */
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

    const today = getTodayDateString();

    let profile = await prisma.bookspaceProfile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      profile = await prisma.bookspaceProfile.create({
        data: {
          user_id: userId,
          bio: 'BookSpace Reader',
          streak_calendar: { dates: [today] },
        },
      });

      return NextResponse.json({
        currentStreak: 1,
        dates: [today],
        totalDays: 1,
      });
    }

    const dates = parseDates(profile.streak_calendar);

    if (!dates.includes(today)) {
      dates.push(today);
    }

    await prisma.bookspaceProfile.update({
      where: { user_id: userId },
      data: {
        streak_calendar: { dates },
      },
    });

    const currentStreak = computeCurrentStreak(dates);

    return NextResponse.json({
      currentStreak,
      dates,
      totalDays: dates.length,
    });
  } catch (error) {
    console.error('Streak POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

