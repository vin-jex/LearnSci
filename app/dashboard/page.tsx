"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TopicGrid } from "@/components/topic/TopicGrid";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { RecommendationsPanel } from "@/components/dashboard/RecommendationsPanel";

interface Stats {
  topicCount: number;
  quizzesCompleted: number;
  avgScore: number | null;
  streak: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Learner";

  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .catch(() => {});
  }, []);

  const statCards = [
    {
      label: t("dashboard.statTopics"),
      value: stats ? String(stats.topicCount) : "-",
      sub: t("dashboard.statTopicsSub"),
    },
    {
      label: t("dashboard.statQuizzes"),
      value: stats ? String(stats.quizzesCompleted) : "-",
      sub: t("dashboard.statQuizzesSub"),
    },
    {
      label: t("dashboard.statAvgScore"),
      value: stats?.avgScore != null ? `${stats.avgScore}%` : "-",
      sub: t("dashboard.statAvgScoreSub"),
    },
    {
      label: t("dashboard.statStreak"),
      value: stats ? String(stats.streak) : "-",
      sub:
        stats?.streak === 1
          ? t("dashboard.statStreakSubSingle")
          : t("dashboard.statStreakSub"),
    },
  ];

  return (
    <div className='animate-fade-up stagger'>
      <div className='mb-10 animate-fade-up'>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
          {t("dashboard.title")}
        </p>
        <h1 className='font-display text-4xl text-ink-100'>
          {t("dashboard.welcome")}, {firstName} 👋
        </h1>
        <p className='text-ink-400 font-body mt-2 max-w-xl'>
          {t("dashboard.description")}
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 animate-fade-up'>
        {statCards.map(({ label, value, sub }) => (
          <div
            key={label}
            className='glass-card rounded-xl p-4 border border-white/5 text-center'
          >
            <p
              className={`font-display text-2xl ${
                value === "-" ? "text-ink-700" : "text-ink-100"
              }`}
            >
              {value}
            </p>
            <p className='text-xs font-semibold text-ink-400 font-body mt-0.5'>
              {label}
            </p>
            <p className='text-xs text-ink-600 font-body'>{sub}</p>
          </div>
        ))}
      </div>

      <RecommendationsPanel />
      <div className='animate-fade-up'>
        <TopicGrid />
      </div>
    </div>
  );
}
