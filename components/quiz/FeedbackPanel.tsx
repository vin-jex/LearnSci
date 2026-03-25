"use client";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface Props {
  isCorrect: boolean;
  feedback: string;
  feedbackIgbo?: string;
  onNext: () => void;
  isLast: boolean;
  isSubmitting: boolean;
}

export function FeedbackPanel({
  isCorrect,
  feedback,
  feedbackIgbo,
  onNext,
  isLast,
  isSubmitting,
}: Props) {
  const { t, isIgbo } = useTranslation();

  const displayFeedback = isIgbo && feedbackIgbo ? feedbackIgbo : feedback;

  return (
    <div
      className={`rounded-xl border p-4 mt-5 animate-fade-in
      ${
        isCorrect
          ? "bg-forest-500/8 border-forest-500/25"
          : "bg-red-500/8 border-red-500/25"
      }`}
    >
      <div className='flex items-start gap-3'>
        <div
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-0.5
          ${isCorrect ? "bg-forest-500/15" : "bg-red-500/15"}`}
        >
          {isCorrect ? (
            <svg
              className='w-4 h-4 text-forest-400'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          ) : (
            <svg
              className='w-4 h-4 text-red-400'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>

        <div className='flex-1'>
          <p
            className={`text-sm font-semibold font-body mb-1
            ${isCorrect ? "text-forest-300" : "text-red-300"}`}
          >
            {isCorrect ? t("quiz.correct") : t("quiz.incorrect")}
          </p>
          <p className='text-sm text-ink-400 font-body leading-relaxed'>
            {displayFeedback}
          </p>
        </div>
      </div>

      <div className='mt-4 flex justify-end'>
        <button
          onClick={onNext}
          disabled={isSubmitting}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold font-body
            transition-all duration-150 flex items-center gap-2 disabled:opacity-50
            ${
              isCorrect
                ? "bg-forest-600 hover:bg-forest-500 text-white"
                : "bg-ink-800 hover:bg-ink-700 text-ink-200 border border-ink-700"
            }`}
        >
          {isSubmitting ? (
            <>
              <div className='spinner' />
              {t("quiz.submit")}…
            </>
          ) : isLast ? (
            `${t("quiz.score")} →`
          ) : (
            `${t("quiz.next")} →`
          )}
        </button>
      </div>
    </div>
  );
}
