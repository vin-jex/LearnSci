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

interface Props {
  topicId: string;
  topicTitle: string;
  topicTitleIgbo?: string;
  questions: Question[];
  keyTerms: KeyTerm[];
  adaptive?: boolean;
}

interface PerQuestionResult {
  isCorrect: boolean;
  feedback: string;
  feedbackIgbo?: string;
  weakArea?: string;
}

export function QuizEngine({
  topicId,
  topicTitle,
  topicTitleIgbo,
  questions,
  keyTerms,
  adaptive = false,
}: Props) {
  const router = useRouter();
  const { t, isIgbo } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [feedback, setFeedback] = useState<PerQuestionResult | null>(null);
  const [results, setResults] = useState<PerQuestionResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [predictedWeakAreas, setPredictedWeakAreas] = useState<string[]>([]);

  const answersRef = useRef<Record<string, string>>({});

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const correctSoFar = results.filter((r) => r.isCorrect).length;

  const displayTitle = isIgbo && topicTitleIgbo ? topicTitleIgbo : topicTitle;

  const handleConfirm = useCallback(async () => {
    if (current.type === "SHORT_ANSWER" && !currentInput.trim()) return;
    if (current.type !== "SHORT_ANSWER" && !currentInput) return;

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
          feedbackIgbo: data.feedbackIgbo,
          weakArea: data.weakArea,
        };
        setFeedback(result);
        setResults((prev) => [...prev, result]);

        if (data.predictedWeakAreas?.length > 0) {
          setPredictedWeakAreas(data.predictedWeakAreas);
        }
      } else {
        const fallback: PerQuestionResult = {
          isCorrect: false,
          feedback: isIgbo ? "Enweghị ike ịnwale. Gaa n'ihu." : "Could not evaluate. Moving on.",
        };
        setFeedback(fallback);
        setResults((prev) => [...prev, fallback]);
      }
    } catch {
      const fallback: PerQuestionResult = {
        isCorrect: false,
        feedback: isIgbo ? "Njehie netwọkụ. Gaa n'ihu." : "Network error. Moving on.",
      };
      setFeedback(fallback);
      setResults((prev) => [...prev, fallback]);
    }
  }, [current, currentInput, topicId, isIgbo]);

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
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": `${topicId}-${Date.now()}`,
        },
        body: JSON.stringify({ topicId, answers: answersRef.current }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? (isIgbo ? "Izipu adighi. Nwaa ọzọ." : "Submission failed. Please try again."));
        setIsSubmitting(false);
        return;
      }

      router.push(`/result/${data.attemptId}`);
    } catch {
      setSubmitError(isIgbo ? "Njehie netwọkụ. Nwaa ọzọ." : "Network error. Please try again.");
      setIsSubmitting(false);
    }
  }, [isLast, topicId, router, isIgbo]);

  const canConfirm =
    feedback === null &&
    (current.type === "SHORT_ANSWER"
      ? currentInput.trim().length > 0
      : currentInput !== "");

  const translatedQuestionText =
    isIgbo && current.questionTextIgbo
      ? current.questionTextIgbo
      : current.questionText;

  const translatedOptions =
    isIgbo && current.optionsIgbo
      ? current.optionsIgbo
      : (current.options as string[]) ?? [];

  return (
    <div className='animate-fade-up'>
      <div className='mb-6'>
        <div className='flex items-center gap-2 mb-1'>
          <p className='text-xs font-semibold uppercase tracking-widest text-forest-500'>
            {t("quiz.start")}
          </p>
          {adaptive && (
            <span className='text-xs px-2 py-0.5 rounded-full bg-earth-400/10 border border-earth-400/20 text-earth-400 font-body'>
              {t("quiz.adaptive")}
            </span>
          )}
        </div>
        <h1 className='font-display text-3xl text-ink-100'>
          {displayTitle}
        </h1>
      </div>

      {predictedWeakAreas.length > 0 && (
        <div className='mb-4 px-4 py-3 rounded-xl bg-earth-400/8 border border-earth-400/20 animate-fade-in'>
          <p className='text-xs font-semibold text-earth-400 font-body mb-1.5'>
            🔍 {t("quiz.areasToWatch")}
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {predictedWeakAreas.map((area, i) => (
              <span
                key={i}
                className='text-xs px-2.5 py-1 rounded-full bg-ink-900/60 border border-ink-700 text-ink-400 font-body'
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

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
                questionText={translatedQuestionText}
                options={translatedOptions}
                selected={currentInput || null}
                onSelect={setCurrentInput}
                feedback={feedback}
                questionNumber={currentIndex + 1}
                total={questions.length}
              />
            )}
            {current.type === "TRUE_FALSE" && (
              <TrueFalseQuestion
                questionText={translatedQuestionText}
                selected={currentInput || null}
                onSelect={setCurrentInput}
                feedback={feedback}
                questionNumber={currentIndex + 1}
                total={questions.length}
              />
            )}
            {current.type === "SHORT_ANSWER" && (
              <ShortAnswerQuestion
                questionText={translatedQuestionText}
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
                feedbackIgbo={feedback.feedbackIgbo}
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
                  className={`w-4 h-4 text-ink-600 transition-transform duration-200
                              ${termsOpen ? "rotate-180" : ""}`}
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
