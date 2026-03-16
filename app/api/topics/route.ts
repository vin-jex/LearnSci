// app/api/topics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topics = await prisma.topic.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { questions: true, lessons: true } },
      },
    });

    // Fetch latest attempt per topic for this user
    const attempts = await prisma.attempt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    const attemptMap = new Map<string, (typeof attempts)[0]>();
    for (const a of attempts) {
      if (!attemptMap.has(a.topicId)) attemptMap.set(a.topicId, a);
    }

    const topicsWithStatus = topics.map((topic) => {
      const attempt = attemptMap.get(topic.id);
      let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" = "NOT_STARTED";
      if (attempt) {
        status = attempt.classification === "STRONG" ? "COMPLETED" : "IN_PROGRESS";
      }
      return {
        ...topic,
        status,
        lastScore: attempt?.score ?? null,
        lastClassification: attempt?.classification ?? null,
        questionCount: topic._count.questions,
        lessonCount: topic._count.lessons,
      };
    });

    return NextResponse.json({ topics: topicsWithStatus });
  } catch (error) {
    console.error("[TOPICS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}
