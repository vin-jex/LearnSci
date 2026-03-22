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

const quizSessionState = new Map<
  string,
  { answered: { questionText: string; isCorrect: boolean; answer: string }[] }
>();

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, answer } = await req.json();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { topic: { select: { title: true } } },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const rules = question.feedbackRules as {
      misconceptions: { pattern: string; feedback: string }[];
      defaultFeedback: string;
    };

    // ── Step 1: Rule-based evaluation ─────────────────────────────
    let result = evaluateAnswer(
      answer,
      question.correctAnswer,
      rules,
      question.type,
    );

    // ── Step 2: NLI for short answers (smarter matching) ──────────
    if (question.type === "SHORT_ANSWER") {
      const nli = await evaluateShortAnswerNLI(
        question.questionText,
        question.correctAnswer,
        answer,
      );
      // Use NLI result if it differs and confidence is high
      if (nli.confidence >= 0.65) {
        result = { ...result, isCorrect: nli.isCorrect };
      }
    }

    // ── Step 3: Augment feedback with HF if no misconception matched
    let feedback = result.feedback;
    const usedDefaultFeedback = feedback === rules.defaultFeedback;
    if (!result.isCorrect && usedDefaultFeedback) {
      feedback = await augmentFeedback(
        question.questionText,
        question.correctAnswer,
        answer,
        rules.defaultFeedback,
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

    let predictedWeakAreas: string[] = [];
    if (state.answered.length >= 3 && state.answered.length % 3 === 0) {
      predictedWeakAreas = await predictWeakAreas(
        question.topic.title,
        state.answered,
      );
    }

    return NextResponse.json({
      isCorrect: result.isCorrect,
      feedback,
      weakArea: result.weakArea,
      predictedWeakAreas,
    });
  } catch (error) {
    console.error("[EVALUATE_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
