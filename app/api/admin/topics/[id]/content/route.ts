import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) return adminCheck;

  const topic = await prisma.topic.findUnique({
    where: { id: params.id },
    include: {
      lessons: true,
      questions: true,
      keyTerms: true,
    },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  return NextResponse.json({ topic });
}

export async function PATCH(req: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) return adminCheck;

  const { entityType, entityId, field, value } = await req.json();

  try {
    if (entityType === "topic") {
      await prisma.topic.update({
        where: { id: entityId },
        data: { [field]: value },
      });
    }

    if (entityType === "lesson") {
      await prisma.lesson.update({
        where: { id: entityId },
        data: { [field]: value },
      });
    }

    if (entityType === "question") {
      await prisma.question.update({
        where: { id: entityId },
        data: { [field]: value },
      });
    }

    if (entityType === "keyTerm") {
      await prisma.keyTerm.update({
        where: { id: entityId },
        data: { [field]: value },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[CONTENT_PATCH]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
