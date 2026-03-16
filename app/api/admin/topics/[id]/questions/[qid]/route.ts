// app/api/admin/topics/[id]/questions/[qid]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; qid: string } }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await request.json();

  const question = await prisma.question.update({
    where: { id: params.qid, topicId: params.id },
    data: body,
  });

  return NextResponse.json({ question });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; qid: string } }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  await prisma.question.delete({ where: { id: params.qid, topicId: params.id } });
  return NextResponse.json({ success: true });
}
