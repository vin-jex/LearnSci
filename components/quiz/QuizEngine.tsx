"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { MCQQuestion } from "./MCQQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";
import { FeedbackPanel } from "./FeedbackPanel";
import { QuizProgress } from "./QuizProgress";
import { KeyTermCard } from "@/components/lesson/KeyTermCard";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface Question {
  id: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  questionText: string;
  options?: string[] | null;
}

interface KeyTerm {
  id: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string | null;
}

interface Props {
  topicId: string;
  topicTitle: string;
  questions: Question[];
  keyTerms: KeyTerm[];
}

interface PerQuestionResult {
  isCorrect: boolean;
  feedback: string;
  weakArea?: string;
}

export function QuizEngine({
  topicId,
  topicTitle,
  questions,
  keyTerms,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [feedback, setFeedback] = useState<PerQuestionResult | null>(null);
  const [results, setResults] = useState<PerQuestionResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);

  const answersRef = useRef<Record<string, string>>({});

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const correctSoFar = results.filter((r) => r.isCorrect).length;

  const handleConfirm = useCallback(async () => {
    if (!currentInput.trim() && current.type === "SHORT_ANSWER") return;
    if (!currentInput && current.type !== "SHORT_ANSWER") return;

    answersRef.current[current.id] = currentInput;

    try {
      const res = await fetch(`/api/quiz/${topicId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: current.id, answer: currentInput }),
      });

      if (res.ok) {
        const data = await res.json();
        const result: PerQuestionResult = {
          isCorrect: data.isCorrect,
          feedback: data.feedback,
          weakArea: data.weakArea,
        };
        setFeedback(result);
        setResults((prev) => [...prev, result]);
      } else {
        const fallback = {
          isCorrect: false,
          feedback: "Could not evaluate. Moving on.",
        };
        setFeedback(fallback);
        setResults((prev) => [...prev, { isCorrect: false, feedback: "" }]);
      }
    } catch {
      const fallback = {
        isCorrect: false,
        feedback: "Network error. Moving on.",
      };
      setFeedback(fallback);
      setResults((prev) => [...prev, { isCorrect: false, feedback: "" }]);
    }
  }, [current, currentInput, topicId]);

  const handleNext = useCallback(async () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setCurrentInput("");
      setFeedback(null);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use the ref - guaranteed to have every answer including the last one
        body: JSON.stringify({ topicId, answers: answersRef.current }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Submission failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/result/${data.attemptId}`);
    } catch {
      setSubmitError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  }, [isLast, topicId, router]);

  const canConfirm =
    feedback === null &&
    (current.type === "SHORT_ANSWER"
      ? currentInput.trim().length > 0
      : currentInput !== "");

  return (
    <div className='animate-fade-up'>
      <div className='mb-6'>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
          {t("quiz.start")}
        </p>
        <h1 className='font-display text-3xl text-ink-100'>{topicTitle}</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start'>
        <div>
          <QuizProgress
            current={currentIndex}
            total={questions.length}
            correctSoFar={correctSoFar}
          />

          <div className='glass-card rounded-2xl p-6 md:p-8 border border-white/5 mb-4'>
            {current.type === "MCQ" && (
              <MCQQuestion
                questionText={current.questionText}
                options={(current.options as string[]) ?? []}
                selected={currentInput || null}
                onSelect={setCurrentInput}
                feedback={feedback}
                questionNumber={currentIndex + 1}
                total={questions.length}
              />
            )}
            {current.type === "TRUE_FALSE" && (
              <TrueFalseQuestion
                questionText={current.questionText}
                selected={currentInput || null}
                onSelect={setCurrentInput}
                feedback={feedback}
                questionNumber={currentIndex + 1}
                total={questions.length}
              />
            )}
            {current.type === "SHORT_ANSWER" && (
              <ShortAnswerQuestion
                questionText={current.questionText}
                value={currentInput}
                onChange={setCurrentInput}
                feedback={feedback}
                questionNumber={currentIndex + 1}
                total={questions.length}
              />
            )}

            {!feedback && (
              <div className='mt-6 flex justify-end'>
                <button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className='btn-primary !w-auto px-6 disabled:opacity-30'
                >
                  {t("quiz.submit")}
                </button>
              </div>
            )}

            {feedback && (
              <FeedbackPanel
                isCorrect={feedback.isCorrect}
                feedback={feedback.feedback}
                onNext={handleNext}
                isLast={isLast}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {submitError && (
            <div className='px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body animate-fade-in'>
              {submitError}
            </div>
          )}
        </div>

        {keyTerms.length > 0 && (
          <div className='lg:sticky lg:top-24 flex flex-col gap-4'>
            <div className='glass-card rounded-2xl border border-white/5 overflow-hidden'>
              <button
                onClick={() => setTermsOpen((o) => !o)}
                className='w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors'
              >
                <span className='text-xs font-semibold uppercase tracking-widest text-ink-500'>
                  {t("lesson.keyTerms")}
                  <span className='ml-2 text-ink-700 normal-case font-normal tracking-normal'>
                    ({keyTerms.length})
                  </span>
                </span>
                <svg
                  className={`w-4 h-4 text-ink-600 transition-transform duration-200 ${termsOpen ? "rotate-180" : ""}`}
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${termsOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className='px-4 pb-4 pt-2 space-y-2 border-t border-white/5 max-h-[380px] overflow-y-auto'>
                  {keyTerms.map((term) => (
                    <KeyTermCard key={term.id} {...term} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
