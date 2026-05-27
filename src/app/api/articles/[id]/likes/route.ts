import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: articleId } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "認証が必要です" }, { status: 401 });

  const userId = session.user.id;
  const existing = await prisma.like.findUnique({ where: { userId_articleId: { userId, articleId } } });

  if (existing) {
    await prisma.like.delete({ where: { userId_articleId: { userId, articleId } } });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.like.create({ data: { userId, articleId } });
    return NextResponse.json({ liked: true });
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: articleId } = await params;
  const session = await getServerSession(authOptions);
  const count = await prisma.like.count({ where: { articleId } });
  const liked = session
    ? !!(await prisma.like.findUnique({
        where: { userId_articleId: { userId: session.user.id, articleId } },
      }))
    : false;
  return NextResponse.json({ count, liked });
}
