import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { translateToIgbo } from "@/lib/hf";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const adminCheck = await requireAdmin();
  if (adminCheck instanceof NextResponse) return adminCheck;

  // Helper: upsert a translation
  const results: { field: string; status: "ok" | "error" }[] = [];
  const upsertTranslation = async (
    entityId: string,
    entityType: string,
    field: string,
    originalText: string,
    relationField: Record<string, string>,
  ) => {
    try {
      const translatedText = await translateToIgbo(originalText);
      await prisma.translation.upsert({
        where: { entityId_locale_field: { entityId, locale: "ig", field } },
        update: { translatedText, updatedAt: new Date() },
        create: {
          entityType,
          entityId,
          locale: "ig",
          field,
          originalText,
          translatedText,
          model: "Helsinki-NLP/opus-mt-en-ig",
          ...relationField,
        },
      });
      results.push({ field: `${entityType}.${field}`, status: "ok" });
    } catch {
      results.push({ field: `${entityType}.${field}`, status: "error" });
    }
  };

  try {
    const topic = await prisma.topic.findUnique({
      where: { id: params.id },
      include: {
        lessons: true,
        keyTerms: true,
        questions: true,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Translate topic fields
    await upsertTranslation(topic.id, "topic", "title", topic.title, {
      topicId: topic.id,
    });
    await upsertTranslation(
      topic.id,
      "topic",
      "description",
      topic.description,
      { topicId: topic.id },
    );

    // Translate lessons (chunk long content by paragraph)
    for (const lesson of topic.lessons) {
      const paragraphs = lesson.content.split("\n\n").filter(Boolean);
      for (let i = 0; i < paragraphs.length; i++) {
        await upsertTranslation(
          lesson.id,
          "lesson",
          `content_p${i}`,
          paragraphs[i],
          { lessonId: lesson.id },
        );
      }
    }

    // Translate key terms
    for (const term of topic.keyTerms) {
      await upsertTranslation(
        term.id,
        "keyterm",
        "englishTerm",
        term.englishTerm,
        { keyTermId: term.id },
      );
    }

    // Translate question texts and feedback
    for (const q of topic.questions) {
      await upsertTranslation(
        q.id,
        "question",
        "questionText",
        q.questionText,
        { questionId: q.id },
      );
      const rules = q.feedbackRules as {
        misconceptions: { pattern: string; feedback: string }[];
        defaultFeedback: string;
      };
      await upsertTranslation(
        q.id,
        "question",
        "defaultFeedback",
        rules.defaultFeedback,
        { questionId: q.id },
      );
    }

    return NextResponse.json({
      message: "Translation complete",
      translated: results.filter((r) => r.status === "ok").length,
      failed: results.filter((r) => r.status === "error").length,
      results,
    });
  } catch (error) {
    console.error("[TRANSLATE]", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
