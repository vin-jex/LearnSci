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

    const topic = await prisma.topic.findUnique({
      where: { id: params.id },
      include: {
        lessons: { orderBy: { order: "asc" } },
        keyTerms: { orderBy: { englishTerm: "asc" } },
        _count: { select: { questions: true } },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Get user's last attempt for this topic
    const lastAttempt = await prisma.attempt.findFirst({
      where: { userId: session.user.id, topicId: params.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      topic: {
        ...topic,
        questionCount: topic._count.questions,
        lastAttempt: lastAttempt ?? null,
      },
    });
  } catch (error) {
    console.error("[TOPIC_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 },
    );
  }
}
