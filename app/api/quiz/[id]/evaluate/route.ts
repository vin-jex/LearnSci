// app/api/quiz/[id]/evaluate/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAnswer } from "@/lib/evaluate";
import { z } from "zod";

const schema = z.object({
  questionId: z.string().min(1),
  answer: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const feedbackRules = question.feedbackRules as {
      misconceptions: { pattern: string; feedback: string }[];
      defaultFeedback: string;
    };

    const result = evaluateAnswer(
      answer,
      question.correctAnswer,
      feedbackRules,
      question.questionText
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[EVALUATE_POST]", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
