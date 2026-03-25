import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankQuestionsByDifficulty } from "@/lib/hf";

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
      select: { id: true, title: true, titleIgbo: true },
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
        questionTextIgbo: true,
        options: true,
        optionsIgbo: true,
        difficulty: true,
      },
    });

    const keyTerms = await prisma.keyTerm.findMany({
      where: { topicId: params.id },
      orderBy: { englishTerm: "asc" },
      select: {
        id: true,
        englishTerm: true,
        igboTerm: true,
        igboExplanation: true,
      },
    });

    // ── Adaptive ordering ─────────────────────────────────────────
    const profile = await prisma.learnerProfile.findUnique({
      where: { userId: session.user.id },
      select: { weaknessEmbedding: true },
    });

    const lastAttempt = await prisma.attempt.findFirst({
      where: { userId: session.user.id, topicId: params.id },
      orderBy: { createdAt: "desc" },
      select: { score: true },
    });

    const targetDifficulty = lastAttempt
      ? Math.min(lastAttempt.score / 100, 0.9)
      : 0.4;

    const learnerEmbedding =
      (profile?.weaknessEmbedding as number[] | null) ?? [];

    const questionsForRanking = questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      difficulty: q.difficulty,
    }));

    const rankedIds = await rankQuestionsByDifficulty(
      questionsForRanking,
      learnerEmbedding,
      targetDifficulty,
    );

    const orderedQuestions = rankedIds
      .map((id) => questions.find((q) => q.id === id))
      .filter(Boolean);

    return NextResponse.json({
      topic,
      questions: orderedQuestions,
      keyTerms,
      adaptive: learnerEmbedding.length > 0,
    });
  } catch (error) {
    console.error("[QUIZ_GET]", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
