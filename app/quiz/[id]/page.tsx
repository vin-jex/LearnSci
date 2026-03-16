"use client";
// app/quiz/[id]/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuizEngine } from "@/components/quiz/QuizEngine";

interface Question {
  id: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  questionText: string;
  options?: string[] | null;
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [topic, setTopic] = useState<{ id: string; title: string } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setTopic(data.topic);
        setQuestions(data.questions);
      })
      .catch(() => setError("Failed to load quiz"))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4 pt-8">
        <div className="h-6 w-24 bg-ink-900 rounded" />
        <div className="h-10 w-64 bg-ink-900 rounded" />
        <div className="h-64 bg-ink-900 rounded-2xl" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-ink-400 font-body">{error ?? "Quiz not found."}</p>
        <Link href="/dashboard" className="text-sm text-forest-400 underline font-body">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-ink-400 font-body mb-4">
          No questions available for this topic yet.
        </p>
        <Link href={`/topic/${params.id}`} className="text-sm text-forest-400 underline font-body">
          Back to Lesson
        </Link>
      </div>
    );
  }

  // Pre-quiz start screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up">
        <div className="glass-card rounded-2xl p-8 border border-white/5 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-forest-600/15 border border-forest-500/20
                          flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-forest-400" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>
            </svg>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-forest-500 mb-2">
            Quiz
          </p>
          <h1 className="font-display text-3xl text-ink-100 mb-2">{topic.title}</h1>
          <p className="text-ink-400 font-body mb-6">
            {questions.length} question{questions.length !== 1 ? "s" : ""} · Answer each
            question and get instant feedback.
          </p>

          {/* Question type breakdown */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {["MCQ", "TRUE_FALSE", "SHORT_ANSWER"].map((type) => {
              const count = questions.filter((q) => q.type === type).length;
              if (!count) return null;
              const labels: Record<string, string> = {
                MCQ: "Multiple Choice",
                TRUE_FALSE: "True / False",
                SHORT_ANSWER: "Short Answer",
              };
              return (
                <span key={type}
                  className="px-3 py-1 text-xs font-body text-ink-400 glass-card
                             rounded-full border border-white/5">
                  {count}× {labels[type]}
                </span>
              );
            })}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="btn-primary !w-auto px-10"
          >
            Begin Quiz →
          </button>

          <div className="mt-4">
            <Link href={`/topic/${params.id}`}
              className="text-xs text-ink-500 hover:text-ink-300 font-body transition-colors">
              ← Back to lesson
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuizEngine
      topicId={topic.id}
      topicTitle={topic.title}
      questions={questions}
    />
  );
}
