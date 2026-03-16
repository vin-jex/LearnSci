"use client";
// components/lesson/LessonViewer.tsx
import Link from "next/link";
import { LessonContent } from "./LessonContent";
import { KeyTermsPanel } from "./KeyTermsPanel";

interface KeyTerm {
  id: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string | null;
}

interface Lesson {
  id: string;
  content: string;
  order: number;
}

interface Attempt {
  score: number;
  classification: string;
}

interface Props {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  topicDuration: string;
  lessons: Lesson[];
  keyTerms: KeyTerm[];
  questionCount: number;
  lastAttempt: Attempt | null;
}

export function LessonViewer({
  topicId,
  topicTitle,
  topicDescription,
  topicDuration,
  lessons,
  keyTerms,
  questionCount,
  lastAttempt,
}: Props) {
  const lesson = lessons[0]; // Currently renders first lesson; multi-lesson pagination is Phase 3+

  return (
    <div className='animate-fade-up'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-2 text-xs text-ink-600 font-body mb-6'>
        <Link
          href='/dashboard'
          className='hover:text-ink-400 transition-colors'
        >
          Dashboard
        </Link>
        <span>›</span>
        <span className='text-ink-400'>{topicTitle}</span>
      </nav>

      {/* Topic header */}
      <div className='mb-8 pb-6 border-b border-white/5'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-xs font-semibold uppercase tracking-widest text-forest-500'>
                Lesson
              </span>
              <span className='text-ink-700'>·</span>
              <span className='text-xs text-ink-500 font-body'>
                {topicDuration}
              </span>
            </div>
            <h1 className='font-display text-3xl md:text-4xl text-ink-100 leading-tight'>
              {topicTitle}
            </h1>
            <p className='text-ink-400 font-body mt-2 max-w-xl'>
              {topicDescription}
            </p>
          </div>

          {/* Last attempt badge */}
          {lastAttempt && (
            <div
              className={`
                px-4 py-2 rounded-xl text-xs font-body font-semibold border
                ${
                  lastAttempt.classification === "STRONG"
                    ? "bg-forest-500/10 border-forest-500/20 text-forest-400"
                    : lastAttempt.classification === "MODERATE"
                      ? "bg-earth-400/10 border-earth-400/20 text-earth-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                }
              `}
            >
              Last score: {Math.round(lastAttempt.score)}%
              <span className='ml-2 opacity-70'>
                ({lastAttempt.classification})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8'>
        {/* Main lesson content */}
        <main>
          {lesson ? (
            <div className='glass-card rounded-2xl p-6 md:p-8 border border-white/5'>
              <LessonContent content={lesson.content} title={topicTitle} />
            </div>
          ) : (
            <div className='glass-card rounded-2xl p-8 border border-white/5 text-center'>
              <p className='text-ink-500 font-body'>
                No lesson content available yet.
              </p>
            </div>
          )}

          {/* Lesson navigation (multi-lesson) */}
          {lessons.length > 1 && (
            <div className='mt-4 flex gap-3'>
              {lessons.map((l, i) => (
                <button
                  key={l.id}
                  className={`
                    px-4 py-2 rounded-lg text-xs font-body font-semibold transition-colors
                    ${
                      i === 0
                        ? "bg-forest-600 text-white"
                        : "glass-card text-ink-400 hover:text-ink-200 border border-white/5"
                    }
                  `}
                >
                  Part {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Bottom quiz CTA (mobile) */}
          <div className='mt-6 lg:hidden'>
            <Link
              href={`/quiz/${topicId}`}
              className='block w-full text-center text-sm font-semibold font-body
                         bg-forest-600 hover:bg-forest-500 text-white py-3 rounded-xl
                         transition-colors duration-200'
            >
              Start Quiz - {questionCount} Questions →
            </Link>
          </div>
        </main>

        {/* Side panel */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <KeyTermsPanel
            keyTerms={keyTerms}
            topicId={topicId}
            questionCount={questionCount}
            lastScore={lastAttempt?.score ?? null}
          />
        </div>
      </div>
    </div>
  );
}
