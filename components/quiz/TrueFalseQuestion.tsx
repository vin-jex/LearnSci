"use client";

interface Props {
  questionText: string;
  selected: string | null;
  onSelect: (val: string) => void;
  feedback: { isCorrect: boolean; feedback: string } | null;
  questionNumber: number;
  total: number;
}

export function TrueFalseQuestion({
  questionText,
  selected,
  onSelect,
  feedback,
  questionNumber,
  total,
}: Props) {
  const englishOptions = ["True", "False"];
  const showResult = feedback !== null;

  return (
    <div className='space-y-5'>
      <div className='flex items-center gap-3'>
        <span className='text-xs font-semibold text-ink-500 font-body uppercase tracking-widest'>
          {questionNumber} / {total}
        </span>
        <span className='w-px h-3 bg-ink-700' />
        <span className='text-xs text-ink-600 font-body'>True / False</span>
      </div>

      <p className='font-display text-xl text-ink-100 leading-snug'>
        {questionText}
      </p>

      <div className='grid grid-cols-2 gap-3'>
        {englishOptions.map((englishVal) => {
          const isSelected = selected === englishVal;
          const isCorrect = showResult && feedback!.isCorrect && isSelected;
          const isWrong = showResult && !feedback!.isCorrect && isSelected;
          const isTrue = englishVal === "True";

          return (
            <button
              key={englishVal}
              onClick={() => !showResult && onSelect(englishVal)}
              disabled={showResult}
              className={`
                py-5 rounded-2xl border text-sm font-semibold font-body
                transition-all duration-150 flex flex-col items-center gap-2
                ${showResult ? "cursor-default" : "cursor-pointer"}
                ${
                  isCorrect
                    ? "border-forest-500/60 bg-forest-500/10 text-forest-300"
                    : isWrong
                      ? "border-red-500/60 bg-red-500/10 text-red-300"
                      : isSelected
                        ? "border-ink-400 bg-ink-800/60 text-ink-200"
                        : "border-ink-800 bg-ink-900/40 text-ink-400 hover:border-ink-600"
                }
              `}
            >
              <span className='text-2xl'>{isTrue ? "✓" : "✗"}</span>
              {englishVal}
            </button>
          );
        })}
      </div>
    </div>
  );
}
