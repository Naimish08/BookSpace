import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ─── POST /api/onboarding ───────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      interests,
      genres,
      fictionTarget,
      nonFictionTarget,
      dailyReadingTime,
      preferredTime,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(genres) || !Array.isArray(interests)) {
      return NextResponse.json(
        { error: 'genres and interests must be arrays' },
        { status: 400 }
      );
    }

    // Build a bio from the user's interests
    const bio =
      interests.length > 0
        ? `Interested in ${interests.join(', ')}. Reading goals: ${fictionTarget ?? 0} fiction & ${nonFictionTarget ?? 0} non-fiction books. Reads ${dailyReadingTime ?? 'daily'}, preferably in the ${preferredTime ?? 'evening'}.`
        : 'BookSpace Reader';

    // Update user genres and upsert profile in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { genres },
      }),
      prisma.bookspaceProfile.upsert({
        where: { user_id: userId },
        create: {
          user_id: userId,
          bio,
          streak_calendar: { dates: [] },
        },
        update: {
          bio,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
