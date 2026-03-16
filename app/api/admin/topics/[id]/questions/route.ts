import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { z } from "zod";

const misconceptionSchema = z.object({
  pattern: z.string().min(1, "Pattern is required"),
  feedback: z.string().min(1, "Feedback is required"),
});

const questionSchema = z.object({
  type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
  questionText: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1)).optional().nullable(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  feedbackRules: z.object({
    misconceptions: z.array(misconceptionSchema),
    defaultFeedback: z.string().min(1, "Default feedback is required"),
  }),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const questions = await prisma.question.findMany({
    where: { topicId: params.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ questions });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const question = await prisma.question.create({
    data: {
      topicId: params.id,
      ...parsed.data,
      options:
        parsed.data.options !== undefined && parsed.data.options !== null
          ? parsed.data.options
          : undefined,
    },
  });

  return NextResponse.json({ question }, { status: 201 });
}
