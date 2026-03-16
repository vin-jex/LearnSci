// lib/hooks/useTopics.ts
"use client";
import { useEffect, useState } from "react";

export interface TopicSummary {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  lastScore: number | null;
  lastClassification: string | null;
  questionCount: number;
  lessonCount: number;
}

export function useTopics() {
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTopics(data.topics);
      })
      .catch(() => setError("Failed to load topics"))
      .finally(() => setIsLoading(false));
  }, []);

  return { topics, isLoading, error };
}
