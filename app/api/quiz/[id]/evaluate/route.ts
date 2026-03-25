import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/evaluate";
import {
  evaluateShortAnswerNLI,
  augmentFeedback,
  predictWeakAreas,
} from "@/lib/hf";
import { z } from "zod";

const schema = z.object({
  questionId: z.string().min(1),
  answer: z.string(),
});

// In-memory mid-quiz state keyed by userId:topicId
const quizSessionState = new Map<
  string,
  { answered: { questionText: string; isCorrect: boolean; answer: string }[] }
>();

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { questionId, answer } = parsed.data;

    const question = await prisma.question.findFirst({
      where: { id: questionId, topicId: params.id },
      include: { topic: { select: { title: true } } },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const feedbackRules = question.feedbackRules as {
      misconceptions: { pattern: string; feedback: string }[];
      defaultFeedback: string;
      defaultFeedbackIgbo?: string;
    };

    // ── Step 1: Rule-based evaluation ─────────────────────────────
    let result = evaluateAnswer(
      answer,
      question.correctAnswer,
      feedbackRules,
      question.questionText,
    );

    // ── Step 2: NLI for short answers ─────────────────────────────
    if (question.type === "SHORT_ANSWER") {
      const nli = await evaluateShortAnswerNLI(
        question.questionText,
        question.correctAnswer,
        answer,
      );
      if (nli.confidence >= 0.65) {
        result = { ...result, isCorrect: nli.isCorrect };
      }
    }

    // ── Step 3: Augment feedback with HF if no misconception matched
    let feedback = result.feedback;
    const usedDefaultFeedback = feedback === feedbackRules.defaultFeedback;
    if (!result.isCorrect && usedDefaultFeedback) {
      feedback = await augmentFeedback(
        question.questionText,
        question.correctAnswer,
        answer,
        feedbackRules.defaultFeedback,
      );
    }

    // ── Step 4: Mid-quiz weak area prediction ─────────────────────
    const sessionKey = `${session.user.id}:${params.id}`;
    const state = quizSessionState.get(sessionKey) ?? { answered: [] };
    state.answered.push({
      questionText: question.questionText,
      isCorrect: result.isCorrect,
      answer,
    });
    quizSessionState.set(sessionKey, state);

    let predictedWeakAreasList: string[] = [];
    if (state.answered.length >= 3 && state.answered.length % 3 === 0) {
      predictedWeakAreasList = await predictWeakAreas(
        question.topic.title,
        state.answered,
      );
    }

    // Use stored Igbo feedback if available, otherwise fall back to English
    const feedbackIgbo = feedbackRules.defaultFeedbackIgbo ?? undefined;

    return NextResponse.json({
      isCorrect: result.isCorrect,
      feedback,
      feedbackIgbo,
      weakArea: result.weakArea,
      predictedWeakAreas: predictedWeakAreasList,
    });
  } catch (error) {
    console.error("[EVALUATE_POST]", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
