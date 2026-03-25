"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface RecommendedTopic {
  id: string;
  title: string;
  titleIgbo?: string;
  description: string;
  descriptionIgbo?: string;
  duration: string;
}

export function RecommendationsPanel() {
  const [topics, setTopics] = useState<RecommendedTopic[]>([]);
  const [personalised, setPersonalised] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, isIgbo } = useTranslation();

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setTopics((data.topics ?? []).slice(0, 3));
          setPersonalised(data.personalised ?? false);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || topics.length === 0) return null;

  return (
    <div className='mb-10 animate-fade-up'>
      <div className='flex items-center gap-2 mb-3'>
        <p className='text-xs font-semibold uppercase tracking-widest text-ink-500'>
          {personalised ? t("recommendations.forYou") : t("recommendations.suggested")}
        </p>
        {personalised && (
          <span className='text-xs px-2 py-0.5 rounded-full bg-earth-400/10 border border-earth-400/20 text-earth-400 font-body'>
            {t("recommendations.aiPersonalised")}
          </span>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        {topics.map((topic) => (
          <Link key={topic.id} href={`/topic/${topic.id}`}>
            <div className='glass-card rounded-xl p-4 border border-white/5 hover:border-earth-400/25 hover:bg-white/[0.02] transition-all duration-200 group h-full'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-5 h-5 rounded-md bg-earth-400/15 border border-earth-400/20 flex items-center justify-center shrink-0'>
                  <svg
                    className='w-2.5 h-2.5 text-earth-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                </div>
                <span className='text-xs text-earth-400 font-body font-semibold'>
                  {t("recommendations.label")}
                </span>
              </div>
              <h3 className='font-display text-sm text-ink-100 mb-1 group-hover:text-earth-300 transition-colors'>
                {isIgbo && topic.titleIgbo ? topic.titleIgbo : topic.title}
              </h3>
              <p className='text-xs text-ink-500 font-body line-clamp-2 leading-relaxed'>
                {isIgbo && topic.descriptionIgbo ? topic.descriptionIgbo : topic.description}
              </p>
              <p className='text-xs text-ink-700 font-body mt-2'>
                {topic.duration}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
