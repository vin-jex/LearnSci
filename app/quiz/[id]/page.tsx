"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface Question {
  id: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  questionText: string;
  questionTextIgbo?: string;
  options?: string[] | null;
  optionsIgbo?: string[] | null;
}

interface KeyTerm {
  id: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string | null;
}

interface Topic {
  id: string;
  title: string;
  titleIgbo?: string;
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const { t, isIgbo } = useTranslation();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [keyTerms, setKeyTerms] = useState<KeyTerm[]>([]);
  const [adaptive, setAdaptive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setTopic(data.topic);
        setQuestions(data.questions);
        setKeyTerms(data.keyTerms ?? []);
        setAdaptive(data.adaptive ?? false);
      })
      .catch(() => setError("Failed to load quiz"))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return (
      <div className='max-w-2xl mx-auto animate-pulse space-y-4 pt-8'>
        <div className='h-6 w-24 bg-ink-900 rounded' />
        <div className='h-10 w-64 bg-ink-900 rounded' />
        <div className='h-64 bg-ink-900 rounded-2xl' />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className='flex flex-col items-center justify-center py-24 gap-4'>
        <p className='text-ink-400 font-body'>{error ?? "Quiz not found."}</p>
        <Link
          href='/dashboard'
          className='text-sm text-forest-400 underline font-body'
        >
          {t("nav.backDashboard")}
        </Link>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className='max-w-2xl mx-auto py-16 text-center'>
        <p className='text-ink-400 font-body mb-4'>
          {isIgbo
            ? "Ọ dịghị ajụjụ maka isiokwu a."
            : "No questions available for this topic yet."}
        </p>
        <Link
          href={`/topic/${params.id}`}
          className='text-sm text-forest-400 underline font-body'
        >
          {isIgbo ? "← Laghachi na ihe ọmụmụ" : "← Back to Lesson"}
        </Link>
      </div>
    );
  }

  const displayTitle =
    isIgbo && topic.titleIgbo ? topic.titleIgbo : topic.title;

  const questionTypeLabels = isIgbo
    ? {
        MCQ: "Nhọrọ Ọtụtụ",
        TRUE_FALSE: "Eziokwu / Asị",
        SHORT_ANSWER: "Azịza Mkpụmkpụ",
      }
    : {
        MCQ: "Multiple Choice",
        TRUE_FALSE: "True / False",
        SHORT_ANSWER: "Short Answer",
      };

  if (!started) {
    return (
      <div className='max-w-2xl mx-auto animate-fade-up'>
        <div className='glass-card rounded-2xl p-8 border border-white/5 text-center'>
          <div className='w-16 h-16 rounded-2xl bg-forest-600/15 border border-forest-500/20 flex items-center justify-center mx-auto mb-6'>
            <svg
              className='w-8 h-8 text-forest-400'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
              />
            </svg>
          </div>

          <div className='flex items-center justify-center gap-2 mb-2'>
            <p className='text-xs font-semibold uppercase tracking-widest text-forest-500'>
              {t("quiz.start")}
            </p>
            {adaptive && (
              <span className='text-xs px-2 py-0.5 rounded-full bg-earth-400/10 border border-earth-400/20 text-earth-400 font-body'>
                {t("quiz.adaptive")}
              </span>
            )}
          </div>

          <h1 className='font-display text-3xl text-ink-100 mb-2'>
            {displayTitle}
          </h1>
          <p className='text-ink-400 font-body mb-6'>
            {questions.length}{" "}
            {isIgbo
              ? "Ajụjụ"
              : questions.length !== 1
                ? "questions"
                : "question"}{" "}
            ·{" "}
            {isIgbo
              ? "Zaa ajụjụ ọ bụla ma nweta nzaaza ozugbo."
              : "Answer each question and get instant feedback."}
          </p>

          <div className='flex flex-wrap gap-2 justify-center mb-4'>
            {(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"] as const).map((type) => {
              const count = questions.filter((q) => q.type === type).length;
              if (!count) return null;
              return (
                <span
                  key={type}
                  className='px-3 py-1 text-xs font-body text-ink-400 glass-card rounded-full border border-white/5'
                >
                  {count} × {questionTypeLabels[type]}
                </span>
              );
            })}
          </div>

          {keyTerms.length > 0 && (
            <p className='text-xs text-ink-600 font-body mb-6'>
              {keyTerms.length}{" "}
              {isIgbo
                ? "okwu isi"
                : keyTerms.length !== 1
                  ? "key terms"
                  : "key term"}{" "}
              {isIgbo
                ? "dị n'ebe a — gbanye Igbo n'akụkụ."
                : "available during the quiz — toggle Igbo in the sidebar."}
            </p>
          )}

          <button
            onClick={() => setStarted(true)}
            className='btn-primary !w-auto px-10'
          >
            {t("quiz.start")} →
          </button>

          <div className='mt-4'>
            <Link
              href={`/topic/${params.id}`}
              className='text-xs text-ink-500 hover:text-ink-300 font-body transition-colors'
            >
              {isIgbo ? "← Laghachi na ihe ọmụmụ" : "← Back to lesson"}
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
      topicTitleIgbo={topic.titleIgbo}
      questions={questions}
      keyTerms={keyTerms}
      adaptive={adaptive}
    />
  );
}
