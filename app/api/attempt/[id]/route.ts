import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attempt = await prisma.attempt.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: {
        topic: {
          select: { id: true, title: true, titleIgbo: true, order: true },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    const nextTopic = await prisma.topic.findFirst({
      where: { order: { gt: attempt.topic.order ?? 0 } },
      orderBy: { order: "asc" },
      select: { id: true, title: true, titleIgbo: true },
    });

    const totalQuestions = await prisma.question.count({
      where: { topicId: attempt.topic.id },
    });

    const correctCount = Math.round((attempt.score / 100) * totalQuestions);

    return NextResponse.json({
      attempt,
      nextTopic,
      totalQuestions,
      correctCount,
    });
  } catch (error) {
    console.error("[ATTEMPT_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 },
    );
  }
}
