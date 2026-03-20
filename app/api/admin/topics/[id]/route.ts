import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  duration: z.string().min(1).optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: {
      lessons: { orderBy: { order: "asc" } },
      keyTerms: { orderBy: { englishTerm: "asc" } },
      questions: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ topic });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const topic = await prisma.topic.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ topic });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  await prisma.topic.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
