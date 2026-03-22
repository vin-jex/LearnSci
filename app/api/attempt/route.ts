import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  evaluateAnswer,
  classifyScore,
  buildPerformanceSummary,
} from "@/lib/evaluate";
import { checkIdempotency, storeIdempotencyResult } from "@/lib/redis";
import { getEmbedding, rankTopicRecommendations } from "@/lib/hf";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Idempotency check ─────────────────────────────────────────
    const idempotencyKey = req.headers.get("x-idempotency-key");
    if (idempotencyKey) {
      const { seen, cachedResult } = await checkIdempotency(idempotencyKey);
      if (seen && cachedResult) {
        return NextResponse.json(JSON.parse(cachedResult));
      }
    }

    const { topicId, answers } = await req.json();
    if (!topicId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const questions = await prisma.question.findMany({
      where: { topicId },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 },
      );
    }

    // ── Evaluate all answers ──────────────────────────────────────
    const results = questions.map((q) => {
      const userAnswer = answers[q.id] ?? "";
      const rules = q.feedbackRules as {
        misconceptions: { pattern: string; feedback: string }[];
        defaultFeedback: string;
      };
      return evaluateAnswer(userAnswer, q.correctAnswer, rules, q.questionText);
    });

    const score =
      (results.filter((r) => r.isCorrect).length / questions.length) * 100;
    const classification = classifyScore(score);

    const summary = buildPerformanceSummary(results, questions.length);

    updateLearnerProfile(session.user.id, summary.weakAreas).catch(
      console.error,
    );

    // ── Transaction: persist attempt ──────────────────────────────
    const attempt = await prisma.$transaction(async (tx) => {
      return tx.attempt.create({
        data: {
          userId: session.user.id,
          topicId,
          score,
          classification,
          weakAreas: summary.weakAreas,
          idempotencyKey: idempotencyKey ?? undefined,
        },
      });
    });

    const responseBody = {
      attemptId: attempt.id,
      score,
      classification,
      correctCount: results.filter((r) => r.isCorrect).length,
      totalQuestions: questions.length,
      weakAreas: summary.weakAreas,
    };

    // ── Store idempotency result ───────────────────────────────────
    if (idempotencyKey) {
      await storeIdempotencyResult(
        idempotencyKey,
        JSON.stringify(responseBody),
      );
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("[ATTEMPT_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function updateLearnerProfile(userId: string, weakAreas: string[]) {
  if (weakAreas.length === 0) return;

  const weakText = weakAreas.join(". ");
  const embedding = await getEmbedding(weakText);
  if (embedding.length === 0) return;

  const allTopics = await prisma.topic.findMany({
    where: { published: true },
    select: { id: true, title: true, description: true },
  });

  const rankedIds = await rankTopicRecommendations(allTopics, weakAreas);

  await prisma.learnerProfile.upsert({
    where: { userId },
    update: {
      weaknessEmbedding: embedding,
      recommendedTopics: rankedIds,
      lastUpdated: new Date(),
    },
    create: {
      userId,
      weaknessEmbedding: embedding,
      recommendedTopics: rankedIds,
    },
  });
}
