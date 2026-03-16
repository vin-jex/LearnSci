// app/api/quiz/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topic = await prisma.topic.findUnique({
      where: { id: params.id },
      select: { id: true, title: true },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const questions = await prisma.question.findMany({
      where: { topicId: params.id },
      select: {
        id: true,
        type: true,
        questionText: true,
        options: true,
        // NOTE: correctAnswer and feedbackRules are NOT returned to the client
        // They are evaluated server-side only via /api/attempt
      },
    });

    return NextResponse.json({ topic, questions });
  } catch (error) {
    console.error("[QUIZ_GET]", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
