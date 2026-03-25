"use client";
import Link from "next/link";
import type { TopicSummary } from "@/lib/hooks/useTopics";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function TopicCard({ topic }: { topic: TopicSummary }) {
  const { t, isIgbo } = useTranslation();

  const STATUS_CONFIG = {
    NOT_STARTED: {
      label: t("dashboard.notStarted"),
      dotColor: "bg-ink-600",
      textColor: "text-ink-600",
      badgeBg: "bg-ink-900/50",
    },
    IN_PROGRESS: {
      label: t("dashboard.inProgress"),
      dotColor: "bg-earth-400",
      textColor: "text-earth-400",
      badgeBg: "bg-earth-400/10",
    },
    COMPLETED: {
      label: t("dashboard.completed"),
      dotColor: "bg-forest-500",
      textColor: "text-forest-400",
      badgeBg: "bg-forest-500/10",
    },
  };

  const cfg = STATUS_CONFIG[topic.status];

  const displayTitle = isIgbo && topic.titleIgbo ? topic.titleIgbo : topic.title;
  const displayDescription = isIgbo && topic.descriptionIgbo ? topic.descriptionIgbo : topic.description;

  return (
    <Link href={`/topic/${topic.id}`}>
      <div className='glass-card rounded-2xl p-5 border border-white/5 cursor-pointer group hover:border-forest-500/25 hover:bg-white/[0.02] transition-all duration-200 h-full flex flex-col'>
        <div className='w-9 h-9 rounded-xl bg-forest-600/15 border border-forest-500/20 flex items-center justify-center mb-4 group-hover:bg-forest-600/25 transition-colors'>
          <svg
            className='w-4 h-4 text-forest-400'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 2-1 3-4 3-4S9.5 3 7.5 8c0 0 .5-3 3-4C10.5 4 4 5 4 11c0 2.5 1 4.5 2 6L8 16c3.15-3.37 9.17-3.5 9-8z' />
          </svg>
        </div>

        <h3 className='font-display text-lg text-ink-100 mb-1 group-hover:text-forest-300 transition-colors'>
          {displayTitle}
        </h3>
        <p className='text-xs text-ink-500 font-body leading-relaxed flex-1 mb-4'>
          {displayDescription}
        </p>

        <div className='flex items-center justify-between gap-2 flex-wrap'>
          <span className='text-xs text-ink-600 font-body'>
            {topic.duration} · {topic.questionCount} {isIgbo ? "Ajụjụ" : "q"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-body font-medium px-2.5 py-1 rounded-full ${cfg.badgeBg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
            <span className={cfg.textColor}>{cfg.label}</span>
          </span>
        </div>

        {topic.lastScore != null && (
          <div className='mt-3 pt-3 border-t border-white/5'>
            <div className='flex items-center justify-between mb-1'>
              <span className='text-xs text-ink-600 font-body'>{t("topic.lastScore")}</span>
              <span
                className={`text-xs font-semibold font-body ${
                  topic.lastScore >= 80
                    ? "text-forest-400"
                    : topic.lastScore >= 50
                      ? "text-earth-400"
                      : "text-red-400"
                }`}
              >
                {Math.round(topic.lastScore)}%
              </span>
            </div>
            <div className='h-1 bg-ink-800 rounded-full overflow-hidden'>
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  topic.lastScore >= 80
                    ? "bg-forest-500"
                    : topic.lastScore >= 50
                      ? "bg-earth-400"
                      : "bg-red-500"
                }`}
                style={{ width: `${topic.lastScore}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
