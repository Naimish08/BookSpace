// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id, email, username, name, address } = await request.json();

    const user = await prisma.user.create({
      data: {
        id,
        email,
        username: username || null,
        name,
        address,
        genres: [],
        created_at: new Date(),
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    // If error is about unique constraint
    if (error.code === 'P2002') {
      // // User already exists
      // const existingUser = await prisma.user.findUnique({
      //   where: { id },
      // });
      return NextResponse.json({ user: "User already exists" }, { status: 200 });
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}



export async function PUT(request: NextRequest) {
  try {
    const { id, username } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { username },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}