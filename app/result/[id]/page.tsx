"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PerformanceSummary } from "@/components/quiz/PerformanceSummary";

interface AttemptData {
  id: string;
  score: number;
  classification: "STRONG" | "MODERATE" | "WEAK";
  weakAreas: string[];
  topic: { id: string; title: string };
  _count?: { questions?: number };
  totalQuestions?: number;
  correctCount?: number;
}

export default function ResultPage({ params }: { params: { id: string } }) {
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [nextTopic, setNextTopic] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [totalQ, setTotalQ] = useState(0);
  const [correctQ, setCorrectQ] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/attempt/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setAttempt(data.attempt);
        setNextTopic(data.nextTopic ?? null);

        // Derive correct count from score
        const total = data.attempt.weakAreas?.length
          ? data.attempt.weakAreas.length +
            Math.round((data.attempt.score / 100) * 3)
          : 3; // fallback
        const correct = Math.round((data.attempt.score / 100) * total);
        setTotalQ(total);
        setCorrectQ(correct);
      })
      .catch(() => setError("Failed to load results"))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className='max-w-2xl mx-auto animate-pulse space-y-4 pt-8'>
        <div className='h-64 bg-ink-900 rounded-2xl' />
        <div className='h-24 bg-ink-900 rounded-2xl' />
        <div className='h-16 bg-ink-900 rounded-2xl' />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className='flex flex-col items-center justify-center py-24 gap-4'>
        <p className='text-ink-400 font-body'>{error ?? "Result not found."}</p>
        <Link
          href='/dashboard'
          className='text-sm text-forest-400 underline font-body'
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <PerformanceSummary
      score={attempt.score}
      totalQuestions={totalQ}
      correctCount={correctQ}
      classification={attempt.classification}
      weakAreas={attempt.weakAreas ?? []}
      topicId={attempt.topic.id}
      topicTitle={attempt.topic.title}
      nextTopic={nextTopic}
    />
  );
}
