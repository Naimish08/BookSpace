// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookspaceProfile: true,
        badges: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

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
  }
}



export async function PUT(request: NextRequest) {
  try {
    const { id, username, bio, name, age, occupation, address, genres } = await request.json();

    const data: any = {};
    if (username !== undefined) data.username = username;
    if (bio !== undefined) data.bio = bio;
    if (name !== undefined) data.name = name;
    if (age !== undefined) data.age = age;
    if (occupation !== undefined) data.occupation = occupation;
    if (address !== undefined) data.address = address;
    if (genres !== undefined) data.genres = genres;

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}