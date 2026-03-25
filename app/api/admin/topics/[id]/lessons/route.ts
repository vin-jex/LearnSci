import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { z } from "zod";

const lessonSchema = z.object({
  content: z.string().min(10, "Lesson content must be at least 10 characters"),
  igboContent: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = lessonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const maxOrder = await prisma.lesson.aggregate({
    where: { topicId: params.id },
    _max: { order: true },
  });

  const lesson = await prisma.lesson.create({
    data: {
      topicId: params.id,
      content: parsed.data.content,
      igboContent: parsed.data.igboContent ?? null,
      order: parsed.data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const { lessonId, ...data } = body;
  if (!lessonId)
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });

  const lesson = await prisma.lesson.update({
    where: { id: lessonId, topicId: params.id },
    data: {
      content: data.content,
      igboContent: data.igboContent ?? null,
      order: data.order,
    },
  });

  return NextResponse.json({ lesson });
}
