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
import { z } from "zod";

const attemptSchema = z.object({
  topicId: z.string().min(1),
  answers: z.record(z.string(), z.string()),
});

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

    const body = await req.json();
    const parsed = attemptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { topicId, answers } = parsed.data;

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
      const feedbackRules = q.feedbackRules as {
        misconceptions: { pattern: string; feedback: string }[];
        defaultFeedback: string;
      };
      return {
        questionId: q.id,
        questionText: q.questionText,
        userAnswer,
        correctAnswer: q.correctAnswer,
        ...evaluateAnswer(
          userAnswer,
          q.correctAnswer,
          feedbackRules,
          q.questionText,
        ),
      };
    });

    const summary = buildPerformanceSummary(results, questions.length);
    const classification = classifyScore(summary.score);

    // ── ML: update learner profile async (non-blocking) ───────────
    updateLearnerProfile(session.user.id, summary.weakAreas).catch(
      console.error,
    );

    // ── Transaction: persist attempt ──────────────────────────────
    const attempt = await prisma.$transaction(async (tx) => {
      return tx.attempt.create({
        data: {
          userId: session.user.id,
          topicId,
          score: summary.score,
          classification,
          weakAreas: summary.weakAreas,
          idempotencyKey: idempotencyKey ?? undefined,
        },
      });
    });

    const responseBody = {
      attemptId: attempt.id,
      results,
      summary,
      score: summary.score,
      classification,
      correctCount: summary.correctCount,
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
      { error: "Failed to submit attempt" },
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
