// app/api/admin/topics/[id]/terms/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { z } from "zod";

const termSchema = z.object({
  englishTerm: z.string().min(1, "English term is required"),
  igboTerm: z.string().min(1, "Igbo term is required"),
  igboExplanation: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = termSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const term = await prisma.keyTerm.create({
    data: { topicId: params.id, ...parsed.data },
  });

  return NextResponse.json({ term }, { status: 201 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { termId } = await request.json();
  if (!termId) return NextResponse.json({ error: "termId required" }, { status: 400 });

  await prisma.keyTerm.delete({ where: { id: termId, topicId: params.id } });
  return NextResponse.json({ success: true });
}
