// app/api/admin/topics/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { z } from "zod";

const createTopicSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true, keyTerms: true, questions: true, attempts: true } },
    },
  });

  return NextResponse.json({ topics });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = createTopicSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const maxOrder = await prisma.topic.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  const topic = await prisma.topic.create({
    data: { ...parsed.data, order: parsed.data.order ?? nextOrder },
  });

  return NextResponse.json({ topic }, { status: 201 });
}
