import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  evaluateAnswer,
  buildPerformanceSummary,
  classifyScore,
} from "@/lib/evaluate";
import { z } from "zod";

const attemptSchema = z.object({
  topicId: z.string().min(1),
  answers: z.record(z.string(), z.string()), // { questionId: userAnswer }
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = attemptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { topicId, answers } = parsed.data;

    // Fetch all questions (with correct answers + feedback rules) - server only
    const questions = await prisma.question.findMany({
      where: { topicId },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 },
      );
    }

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

    const attempt = await prisma.attempt.create({
      data: {
        userId: session.user.id,
        topicId,
        score: summary.score,
        classification: classifyScore(summary.score),
        weakAreas: summary.weakAreas,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      results,
      summary,
    });
  } catch (error) {
    console.error("[ATTEMPT_POST]", error);
    return NextResponse.json(
      { error: "Failed to submit attempt" },
      { status: 500 },
    );
  }
}
