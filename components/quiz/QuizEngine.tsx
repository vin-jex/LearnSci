"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MCQQuestion } from "./MCQQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";
import { FeedbackPanel } from "./FeedbackPanel";
import { QuizProgress } from "./QuizProgress";
// import { evaluateAnswer } from "@/lib/evaluate";

interface Question {
  id: string;
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  questionText: string;
  options?: string[] | null;
}

// interface QuestionWithAnswer extends Question {
//   correctAnswer: string;
//   feedbackRules: {
//     misconceptions: { pattern: string; feedback: string }[];
//     defaultFeedback: string;
//   };
// }

interface Props {
  topicId: string;
  topicTitle: string;
  questions: Question[];
}

interface PerQuestionResult {
  isCorrect: boolean;
  feedback: string;
  weakArea?: string;
}

export function QuizEngine({ topicId, topicTitle, questions }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState("");
  const [feedback, setFeedback] = useState<PerQuestionResult | null>(null);
  const [results, setResults] = useState<PerQuestionResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const correctSoFar = results.filter((r) => r.isCorrect).length;

  // Handle answer confirmation (per-question immediate feedback via server)
  const handleConfirm = useCallback(async () => {
    if (!currentInput.trim() && current.type === "SHORT_ANSWER") return;
    if (!currentInput && current.type !== "SHORT_ANSWER") return;

    // Fetch evaluation from server
    try {
      const res = await fetch(`/api/quiz/${topicId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: current.id,
          answer: currentInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const result: PerQuestionResult = {
          isCorrect: data.isCorrect,
          feedback: data.feedback,
          weakArea: data.weakArea,
        };
        setFeedback(result);
        setAnswers((prev) => ({ ...prev, [current.id]: currentInput }));
        setResults((prev) => [...prev, result]);
      } else {
        // Fallback: just record the answer without feedback
        setFeedback({
          isCorrect: false,
          feedback: "Could not evaluate. Moving on.",
        });
        setAnswers((prev) => ({ ...prev, [current.id]: currentInput }));
        setResults((prev) => [...prev, { isCorrect: false, feedback: "" }]);
      }
    } catch {
      setFeedback({ isCorrect: false, feedback: "Network error. Moving on." });
      setAnswers((prev) => ({ ...prev, [current.id]: currentInput }));
      setResults((prev) => [...prev, { isCorrect: false, feedback: "" }]);
    }
  }, [current, currentInput, topicId]);

  // Move to next question or submit final attempt
  const handleNext = useCallback(async () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setCurrentInput("");
      setFeedback(null);
      return;
    }

    // Final submission
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, answers }),
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
  }, [isLast, topicId, answers, router]);

  const canConfirm =
    feedback === null &&
    (current.type === "SHORT_ANSWER"
      ? currentInput.trim().length > 0
      : currentInput !== "");

  return (
    <div className='max-w-2xl mx-auto animate-fade-up'>
      {/* Header */}
      <div className='mb-8'>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
          Quiz
        </p>
        <h1 className='font-display text-3xl text-ink-100'>{topicTitle}</h1>
      </div>

      {/* Progress */}
      <QuizProgress
        current={currentIndex}
        total={questions.length}
        correctSoFar={correctSoFar}
      />

      {/* Question card */}
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

        {/* Confirm button - shown before feedback */}
        {!feedback && (
          <div className='mt-6 flex justify-end'>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className='btn-primary !w-auto px-6 disabled:opacity-30'
            >
              Confirm Answer
            </button>
          </div>
        )}

        {/* Feedback panel - shown after confirm */}
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

      {/* Submit error */}
      {submitError && (
        <div
          className='px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                        text-red-400 text-sm font-body animate-fade-in'
        >
          {submitError}
        </div>
      )}
    </div>
  );
}
