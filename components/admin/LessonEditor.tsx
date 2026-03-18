// components/admin/LessonEditor.tsx
"use client";
import { useState } from "react";
import { LessonContent } from "@/components/lesson/LessonContent";

interface Lesson {
  id: string;
  content: string;
  order: number;
}
interface Props {
  topicId: string;
  lessons: Lesson[];
  onSaved: () => void;
}

export function LessonEditor({ topicId, lessons, onSaved }: Props) {
  const lesson = lessons[0];
  const [content, setContent] = useState(lesson?.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    const method = lesson ? "PATCH" : "POST";
    const body = lesson
      ? { lessonId: lesson.id, content, order: lesson.order }
      : { content, order: 1 };

    const res = await fetch(`/api/admin/topics/${topicId}/lessons`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setIsSaving(false);
    if (!res.ok) {
      const j = await res.json();
      setError(j.error);
      return;
    }
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Toolbar */}
      <div className='flex items-center justify-between flex-wrap gap-3'>
        <p className='text-sm text-ink-400 font-body'>
          Write lesson content in{" "}
          <a
            href='https://www.markdownguide.org/basic-syntax/'
            target='_blank'
            className='text-forest-400 underline underline-offset-2'
          >
            Markdown
          </a>
          . Use{" "}
          <code className='text-xs bg-ink-800 px-1 py-0.5 rounded'>##</code>{" "}
          headings,{" "}
          <code className='text-xs bg-ink-800 px-1 py-0.5 rounded'>
            **bold**
          </code>
          ,{" "}
          <code className='text-xs bg-ink-800 px-1 py-0.5 rounded'>
            - lists
          </code>
          ,{" "}
          <code className='text-xs bg-ink-800 px-1 py-0.5 rounded'>
            | table |
          </code>
          .
        </p>
        <button
          onClick={() => setPreview((p) => !p)}
          className={`text-xs font-body font-semibold border px-3 py-1.5 rounded-lg transition-colors
            ${
              preview
                ? "bg-forest-600/15 border-forest-500/30 text-forest-400"
                : "border-ink-700 text-ink-500 hover:text-ink-300 hover:border-ink-600"
            }`}
        >
          {preview ? "✏️ Edit" : "👁 Preview"}
        </button>
      </div>

      {error && (
        <div
          className='px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                        text-red-400 text-sm font-body'
        >
          {error}
        </div>
      )}
      {saved && (
        <div
          className='px-4 py-3 rounded-xl bg-forest-500/10 border border-forest-500/20
                        text-forest-400 text-sm font-body'
        >
          ✓ Lesson saved
        </div>
      )}

      {preview ? (
        <div className='glass-card rounded-2xl p-6 md:p-8 border border-white/5 min-h-[400px]'>
          {content.trim() ? (
            <LessonContent content={content} title='' />
          ) : (
            <p className='text-ink-600 italic font-body text-sm'>
              Nothing to preview yet.
            </p>
          )}
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={22}
          placeholder={`## What is Photosynthesis?\n\nPhotosynthesis is the process by which **green plants** use sunlight...\n\n### Key Points\n- Plants absorb CO₂\n- Produce oxygen and glucose\n\n> The equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\n### Inputs and Outputs\n\n| Input | Source |\n|---|---|\n| Carbon dioxide | Air |\n| Water | Soil |`}
          className='w-full bg-ink-900/50 border border-ink-700 rounded-2xl p-5
                     text-sm text-ink-200 font-mono placeholder-ink-700
                     focus:outline-none focus:border-forest-500/50
                     focus:ring-2 focus:ring-forest-500/10
                     resize-y transition-colors duration-200 min-h-[400px]'
        />
      )}

      <div className='flex justify-end'>
        <button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className='btn-primary !w-auto px-8 flex items-center gap-2'
        >
          {isSaving ? (
            <>
              <div className='spinner' />
              Saving…
            </>
          ) : (
            "Save Lesson"
          )}
        </button>
      </div>
    </div>
  );
}
