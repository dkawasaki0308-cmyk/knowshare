import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? "";

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(q && {
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      }),
      ...(tag && { tags: { some: { tag: { name: tag } } } }),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  const { title, content, tags } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "タイトルと本文は必須です" }, { status: 400 });
  }

  const article = await prisma.article.create({
    data: {
      title,
      content,
      authorId: session.user.id,
      tags: {
        create: (tags as string[]).map((name: string) => ({
          tag: {
            connectOrCreate: { where: { name }, create: { name } },
          },
        })),
      },
    },
    include: {
      author: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(article, { status: 201 });
}
