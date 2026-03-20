"use client";
import { useEffect, useState } from "react";

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
  id: string;
  score: number;
  classification: string;
  createdAt: string;
}

interface TopicDetail {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  keyTerms: KeyTerm[];
  questionCount: number;
  lastAttempt: Attempt | null;
}

export function useTopic(topicId: string) {
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicId) return;
    setIsLoading(true);
    fetch(`/api/topics/${topicId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTopic(data.topic);
      })
      .catch(() => setError("Failed to load topic"))
      .finally(() => setIsLoading(false));
  }, [topicId]);

  return { topic, isLoading, error };
}
