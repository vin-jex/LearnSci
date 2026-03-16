"use client";
// components/quiz/QuizProgress.tsx

interface Props {
  current: number;   // 0-indexed current question
  total: number;
  correctSoFar: number;
}

export function QuizProgress({ current, total, correctSoFar }: Props) {
  const percent = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="mb-6">
      {/* Labels */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-ink-500 font-body">
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span className="text-xs text-ink-500 font-body">
          {correctSoFar} correct so far
        </span>
      </div>
      {/* Bar */}
      <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-forest-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
