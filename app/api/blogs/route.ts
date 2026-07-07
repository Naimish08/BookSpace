import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      }),
      prisma.blogPost.count({ where: { published: true } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      { posts, total, page, totalPages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorId, title, content, excerpt, coverImage, published } =
      await request.json();

    if (!authorId || !title || !content) {
      return NextResponse.json(
        { error: "authorId, title, and content are required" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        author_id: authorId,
        title,
        content,
        excerpt: excerpt || null,
        cover_image: coverImage || null,
        published: published ?? false,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
