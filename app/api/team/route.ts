import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/team
 * Fetches community team members categorized by team.
 */
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany();

    if (teamMembers.length === 0) {
      // Default initial team members
      const defaults = [
        { id: '1', name: 'Aarav Sharma', image: '/placeholder-user.jpg', team: 'Design', designation: 'Lead Designer' },
        { id: '2', name: 'Ananya Patel', image: '/placeholder-user.jpg', team: 'Events', designation: 'Community Coordinator' },
        { id: '3', name: 'Rohan Mehta', image: '/placeholder-user.jpg', team: 'Marketing', designation: 'Growth Specialist' },
      ];
      return NextResponse.json(defaults);
    }

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Team GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
