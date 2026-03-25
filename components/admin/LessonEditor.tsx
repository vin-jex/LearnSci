"use client";
import { useState } from "react";
import { LessonContent } from "@/components/lesson/LessonContent";

interface Lesson {
  id: string;
  content: string;
  igboContent?: string;
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
  const [igboContent, setIgboContent] = useState(lesson?.igboContent ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"english" | "igbo">("english");

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    const method = lesson ? "PATCH" : "POST";
    const body = lesson
      ? { lessonId: lesson.id, content, igboContent, order: lesson.order }
      : { content, igboContent, order: 1 };

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

  const currentContent = activeTab === "english" ? content : igboContent;
  const setCurrentContent = activeTab === "english" ? setContent : setIgboContent;

  return (
    <div className='flex flex-col gap-4'>
      {/* Language tabs */}
      <div className='flex items-center gap-1 border-b border-white/5'>
        <button
          onClick={() => setActiveTab("english")}
          className={`px-4 py-2 text-xs font-body font-semibold rounded-t-lg transition-colors border-b-2 -mb-px
            ${activeTab === "english" ? "text-forest-300 border-forest-400" : "text-ink-500 border-transparent hover:text-ink-300"}`}
        >
          English
        </button>
        <button
          onClick={() => setActiveTab("igbo")}
          className={`px-4 py-2 text-xs font-body font-semibold rounded-t-lg transition-colors border-b-2 -mb-px flex items-center gap-1.5
            ${activeTab === "igbo" ? "text-earth-300 border-earth-400" : "text-ink-500 border-transparent hover:text-ink-300"}`}
        >
          <span className='flex items-center gap-0.5'>
            <span className='w-1.5 h-2 rounded-sm bg-forest-600 opacity-80' />
            <span className='w-1.5 h-2 rounded-sm bg-white opacity-30' />
            <span className='w-1.5 h-2 rounded-sm bg-forest-600 opacity-80' />
          </span>
          Igbo
          {igboContent && <span className='w-1.5 h-1.5 rounded-full bg-earth-400' />}
        </button>
      </div>

      {/* Toolbar */}
      <div className='flex items-center justify-between flex-wrap gap-3'>
        <p className='text-sm text-ink-400 font-body'>
          {activeTab === "igbo"
            ? "Dee ọdịnaya ihe ọmụmụ n'Igbo (Markdown)."
            : <>Write lesson content in{" "}
              <a href='https://www.markdownguide.org/basic-syntax/' target='_blank' className='text-forest-400 underline underline-offset-2'>Markdown</a>.</>
          }
        </p>
        <button
          onClick={() => setPreview((p) => !p)}
          className={`text-xs font-body font-semibold border px-3 py-1.5 rounded-lg transition-colors
            ${preview
              ? "bg-forest-600/15 border-forest-500/30 text-forest-400"
              : "border-ink-700 text-ink-500 hover:text-ink-300 hover:border-ink-600"
            }`}
        >
          {preview ? "✏️ Edit" : "👁 Preview"}
        </button>
      </div>

      {error && (
        <div className='px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body'>
          {error}
        </div>
      )}
      {saved && (
        <div className='px-4 py-3 rounded-xl bg-forest-500/10 border border-forest-500/20 text-forest-400 text-sm font-body'>
          ✓ Lesson saved
        </div>
      )}

      {preview ? (
        <div className='glass-card rounded-2xl p-6 md:p-8 border border-white/5 min-h-[400px]'>
          {currentContent.trim() ? (
            <LessonContent
              content={activeTab === "english" ? currentContent : content}
              igboContent={activeTab === "igbo" ? currentContent : igboContent}
              title=''
            />
          ) : (
            <p className='text-ink-600 italic font-body text-sm'>Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          rows={22}
          placeholder={activeTab === "igbo"
            ? "## Gịnị Bụ Photosynthesis?\n\nPhotosynthesis bụ usoro…"
            : "## What is Photosynthesis?\n\nPhotosynthesis is the process by which **green plants** use sunlight…"
          }
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
