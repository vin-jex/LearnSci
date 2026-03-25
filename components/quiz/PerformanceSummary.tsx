"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/hooks/useTranslation";

type Classification = "STRONG" | "MODERATE" | "WEAK";

interface Props {
  score: number;
  totalQuestions: number;
  correctCount: number;
  classification: Classification;
  weakAreas: string[];
  topicId: string;
  topicTitle: string;
  topicTitleIgbo?: string;
  nextTopic: { id: string; title: string; titleIgbo?: string } | null;
}

const CLASS_CONFIG: Record<
  Classification,
  { color: string; bg: string; border: string; ring: string; emoji: string }
> = {
  STRONG: {
    emoji: "🏆",
    color: "text-forest-400",
    bg: "bg-forest-500/10",
    border: "border-forest-500/30",
    ring: "ring-forest-500/20",
  },
  MODERATE: {
    emoji: "📈",
    color: "text-earth-400",
    bg: "bg-earth-400/10",
    border: "border-earth-400/30",
    ring: "ring-earth-400/20",
  },
  WEAK: {
    emoji: "📖",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    ring: "ring-red-500/20",
  },
};

export function PerformanceSummary({
  score,
  totalQuestions,
  correctCount,
  classification,
  weakAreas,
  topicId,
  topicTitle,
  topicTitleIgbo,
  nextTopic,
}: Props) {
  const { t, isIgbo } = useTranslation();
  const cfg = CLASS_CONFIG[classification];
  const wrongCount = totalQuestions - correctCount;
  const scoreRounded = Math.round(score);

  const displayTitle = isIgbo && topicTitleIgbo ? topicTitleIgbo : topicTitle;

  const classLabel = t(
    classification === "STRONG"
      ? "performance.strong"
      : classification === "MODERATE"
        ? "performance.moderate"
        : "performance.weak",
  );

  const recommendation = t(
    classification === "STRONG"
      ? "performance.recommendStrong"
      : classification === "MODERATE"
        ? "performance.recommendModerate"
        : "performance.recommendWeak",
  );

  const nextTopicTitle =
    nextTopic
      ? isIgbo && nextTopic.titleIgbo
        ? nextTopic.titleIgbo
        : nextTopic.title
      : "";

  return (
    <div className='max-w-2xl mx-auto animate-fade-up stagger'>
      <div className='text-center mb-8 animate-fade-up'>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
          {t("quiz.score")}
        </p>
        <h1 className='font-display text-4xl text-ink-100 mb-1'>
          {displayTitle}
        </h1>
        <p className='text-ink-500 font-body text-sm'>{t("quiz.complete")}</p>
      </div>

      <div
        className={`glass-card rounded-2xl p-8 border ${cfg.border} ${cfg.bg} text-center mb-5 animate-fade-up ring-4 ${cfg.ring}`}
      >
        <div className='text-6xl mb-3'>{cfg.emoji}</div>
        <p className={`font-display text-7xl ${cfg.color} mb-1`}>
          {scoreRounded}%
        </p>
        <p className={`text-sm font-semibold font-body ${cfg.color} mb-4`}>
          {classLabel}
        </p>

        <div className='flex items-center justify-center gap-6 text-sm font-body'>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-forest-500' />
            <span className='text-ink-400'>{correctCount} {t("performance.correct")}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-red-500' />
            <span className='text-ink-400'>{wrongCount} {t("performance.incorrect")}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-ink-600' />
            <span className='text-ink-400'>{totalQuestions} {t("performance.total")}</span>
          </div>
        </div>

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
          {t("performance.recommendation")}
        </p>
        <p className='text-sm text-ink-300 font-body leading-relaxed'>
          {recommendation}
        </p>
      </div>

      {/* Weak areas */}
      {weakAreas.length > 0 && (
        <div className='glass-card rounded-2xl p-5 border border-red-500/15 mb-5 animate-fade-up'>
          <p className='text-xs font-semibold uppercase tracking-widest text-red-400 mb-3'>
            {t("performance.areasToReview")}
          </p>
          <ul className='space-y-2'>
            {Array.from(new Set(weakAreas)).map((area, i) => (
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
        {classification === "STRONG" && nextTopic && (
          <Link
            href={`/topic/${nextTopic.id}`}
            className='flex-1 text-center py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-sm font-semibold font-body transition-colors'
          >
            {t("performance.nextTopic")}: {nextTopicTitle} →
          </Link>
        )}
        <Link
          href={`/topic/${topicId}`}
          className='flex-1 text-center py-3 rounded-xl glass-card border border-white/5 text-ink-300 hover:text-ink-100 text-sm font-semibold font-body transition-colors hover:border-white/10'
        >
          {t("performance.reviewLesson")}
        </Link>
        <Link
          href={`/quiz/${topicId}`}
          className={`flex-1 text-center py-3 rounded-xl text-sm font-semibold font-body transition-colors
            ${
              classification === "WEAK"
                ? "bg-ink-800 hover:bg-ink-700 text-ink-200 border border-ink-700"
                : "glass-card border border-white/5 text-ink-400 hover:text-ink-200"
            }`}
        >
          {t("performance.retakeQuiz")}
        </Link>
      </div>

      <div className='text-center mt-6 animate-fade-up'>
        <Link
          href='/dashboard'
          className='text-xs text-ink-600 hover:text-ink-400 font-body transition-colors'
        >
          {t("nav.backDashboard")}
        </Link>
      </div>
    </div>
  );
}
