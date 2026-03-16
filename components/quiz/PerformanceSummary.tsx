"use client";
// components/quiz/PerformanceSummary.tsx
import Link from "next/link";

type Classification = "STRONG" | "MODERATE" | "WEAK";

interface Props {
  score: number;
  totalQuestions: number;
  correctCount: number;
  classification: Classification;
  weakAreas: string[];
  topicId: string;
  topicTitle: string;
  nextTopic: { id: string; title: string } | null;
}

const CLASS_CONFIG: Record<
  Classification,
  {
    label: string;
    emoji: string;
    color: string;
    bg: string;
    border: string;
    ring: string;
  }
> = {
  STRONG: {
    label: "Strong",
    emoji: "🏆",
    color: "text-forest-400",
    bg: "bg-forest-500/10",
    border: "border-forest-500/30",
    ring: "ring-forest-500/20",
  },
  MODERATE: {
    label: "Moderate",
    emoji: "📈",
    color: "text-earth-400",
    bg: "bg-earth-400/10",
    border: "border-earth-400/30",
    ring: "ring-earth-400/20",
  },
  WEAK: {
    label: "Needs Review",
    emoji: "📖",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    ring: "ring-red-500/20",
  },
};

const RECOMMENDATION: Record<Classification, string> = {
  STRONG:
    "Excellent work! You've mastered this topic. Unlock the next lesson to keep going.",
  MODERATE:
    "Good effort! Review the lesson sections related to your weak areas, then try again.",
  WEAK: "Keep going - science takes practice! Please review the full lesson before retaking.",
};

export function PerformanceSummary({
  score,
  totalQuestions,
  correctCount,
  classification,
  weakAreas,
  topicId,
  topicTitle,
  nextTopic,
}: Props) {
  const cfg = CLASS_CONFIG[classification];
  const wrongCount = totalQuestions - correctCount;
  const scoreRounded = Math.round(score);

  return (
    <div className='max-w-2xl mx-auto animate-fade-up stagger'>
      {/* Header */}
      <div className='text-center mb-8 animate-fade-up'>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
          Results
        </p>
        <h1 className='font-display text-4xl text-ink-100 mb-1'>
          {topicTitle}
        </h1>
        <p className='text-ink-500 font-body text-sm'>Quiz complete</p>
      </div>

      {/* Score ring card */}
      <div
        className={`
          glass-card rounded-2xl p-8 border ${cfg.border} ${cfg.bg}
          text-center mb-5 animate-fade-up ring-4 ${cfg.ring}
        `}
      >
        <div className='text-6xl mb-3'>{cfg.emoji}</div>
        <p className={`font-display text-7xl ${cfg.color} mb-1`}>
          {scoreRounded}%
        </p>
        <p className={`text-sm font-semibold font-body ${cfg.color} mb-4`}>
          {cfg.label}
        </p>

        {/* Breakdown */}
        <div className='flex items-center justify-center gap-6 text-sm font-body'>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-forest-500' />
            <span className='text-ink-400'>{correctCount} correct</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-red-500' />
            <span className='text-ink-400'>{wrongCount} incorrect</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-ink-600' />
            <span className='text-ink-400'>{totalQuestions} total</span>
          </div>
        </div>

        {/* Visual score bar */}
        <div className='mt-5 h-2 bg-ink-800 rounded-full overflow-hidden max-w-xs mx-auto'>
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              classification === "STRONG"
                ? "bg-forest-500"
                : classification === "MODERATE"
                  ? "bg-earth-400"
                  : "bg-red-500"
            }`}
            style={{ width: `${scoreRounded}%` }}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className='glass-card rounded-2xl p-5 border border-white/5 mb-5 animate-fade-up'>
        <p className='text-xs font-semibold uppercase tracking-widest text-ink-500 mb-2'>
          Recommendation
        </p>
        <p className='text-sm text-ink-300 font-body leading-relaxed'>
          {RECOMMENDATION[classification]}
        </p>
      </div>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <div className='glass-card rounded-2xl p-5 border border-red-500/15 mb-5 animate-fade-up'>
          <p className='text-xs font-semibold uppercase tracking-widest text-red-400 mb-3'>
            Areas to Review
          </p>
          <ul className='space-y-2'>
            {[...new Set(weakAreas)].map((area, i) => (
              <li
                key={i}
                className='flex items-start gap-2 text-sm text-ink-400 font-body'
              >
                <span className='text-red-500 mt-0.5 shrink-0'>›</span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className='flex flex-col sm:flex-row gap-3 animate-fade-up'>
        {/* Next topic - only for STRONG */}
        {classification === "STRONG" && nextTopic && (
          <Link
            href={`/topic/${nextTopic.id}`}
            className='flex-1 text-center py-3 rounded-xl bg-forest-600 hover:bg-forest-500
                       text-white text-sm font-semibold font-body transition-colors'
          >
            Next Topic: {nextTopic.title} →
          </Link>
        )}

        {/* Review lesson */}
        <Link
          href={`/topic/${topicId}`}
          className='flex-1 text-center py-3 rounded-xl glass-card border border-white/5
                     text-ink-300 hover:text-ink-100 text-sm font-semibold font-body
                     transition-colors hover:border-white/10'
        >
          Review Lesson
        </Link>

        {/* Retake quiz */}
        <Link
          href={`/quiz/${topicId}`}
          className={`
            flex-1 text-center py-3 rounded-xl text-sm font-semibold font-body transition-colors
            ${
              classification === "WEAK"
                ? "bg-ink-800 hover:bg-ink-700 text-ink-200 border border-ink-700"
                : "glass-card border border-white/5 text-ink-400 hover:text-ink-200"
            }
          `}
        >
          Retake Quiz
        </Link>
      </div>

      {/* Back to dashboard */}
      <div className='text-center mt-6 animate-fade-up'>
        <Link
          href='/dashboard'
          className='text-xs text-ink-600 hover:text-ink-400 font-body transition-colors'
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
