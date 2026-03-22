import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { generateQuestions } from "@/lib/hf";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) return adminCheck;

  try {
    const { count = 5 } = await req.json().catch(() => ({}));

    const topic = await prisma.topic.findUnique({
      where: { id: params.id },
      include: { lessons: { orderBy: { order: "asc" }, take: 1 } },
    });

    if (!topic || topic.lessons.length === 0) {
      return NextResponse.json(
        { error: "Topic or lesson not found" },
        { status: 404 },
      );
    }

    const generated = await generateQuestions(
      topic.title,
      topic.lessons[0].content,
      count,
    );

    if (generated.length === 0) {
      return NextResponse.json(
        { error: "Model returned no valid questions. Try again." },
        { status: 422 },
      );
    }

    // Save as draft questions (published via admin review)
    const created = await prisma.$transaction(
      generated.map((q) =>
        prisma.question.create({
          data: {
            topicId: params.id,
            type: q.type,
            questionText: q.questionText,
            options: q.options ?? [],
            correctAnswer: q.correctAnswer,
            feedbackRules: {
              misconceptions: [],
              defaultFeedback: q.defaultFeedback,
            },
          },
        }),
      ),
    );

    return NextResponse.json({
      message: `Generated ${created.length} questions`,
      questions: created,
    });
  } catch (error) {
    console.error("[GENERATE_QUESTIONS]", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
