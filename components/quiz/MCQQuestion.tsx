"use client";

interface Props {
  questionText: string;
  options: string[];
  selected: string | null;
  onSelect: (val: string) => void;
  feedback: { isCorrect: boolean; feedback: string } | null;
  questionNumber: number;
  total: number;
  englishOptions?: string[];
}

export function MCQQuestion({
  questionText,
  options,
  selected,
  onSelect,
  feedback,
  questionNumber,
  total,
  englishOptions,
}: Props) {
  const sourceOptions = englishOptions ?? options;
  const selectedIndex =
    selected !== null ? sourceOptions.indexOf(selected) : -1;

  return (
    <div className='space-y-5'>
      <QuestionHeader
        number={questionNumber}
        total={total}
        type='Multiple Choice'
      />
      <p className='font-display text-xl text-ink-100 leading-snug'>
        {questionText}
      </p>

      <div className='grid gap-3'>
        {options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const showResult = feedback !== null;
          const isCorrectAnswer =
            showResult && feedback!.isCorrect && isSelected;
          const isWrongAnswer =
            showResult && !feedback!.isCorrect && isSelected;

          return (
            <button
              key={idx}
              onClick={() => {
                if (!showResult) {
                  onSelect(sourceOptions[idx] ?? opt);
                }
              }}
              disabled={showResult}
              className={`
                w-full text-left px-5 py-3.5 rounded-xl border text-sm font-body
                transition-all duration-150 relative overflow-hidden
                ${
                  showResult
                    ? "cursor-default"
                    : "cursor-pointer hover:border-forest-500/40 hover:bg-forest-500/5"
                }
                ${
                  isCorrectAnswer
                    ? "border-forest-500/60 bg-forest-500/10 text-forest-300"
                    : isWrongAnswer
                      ? "border-red-500/60 bg-red-500/10 text-red-300"
                      : isSelected
                        ? "border-ink-400 bg-ink-800/60 text-ink-200"
                        : "border-ink-800 bg-ink-900/40 text-ink-300"
                }
              `}
            >
              <span className='flex items-center gap-3'>
                {/* Option letter */}
                <span
                  className={`
                    w-6 h-6 shrink-0 rounded-full border text-xs font-semibold
                    flex items-center justify-center
                    ${
                      isCorrectAnswer
                        ? "border-forest-500 text-forest-400 bg-forest-500/10"
                        : isWrongAnswer
                          ? "border-red-500 text-red-400 bg-red-500/10"
                          : isSelected
                            ? "border-ink-300 text-ink-200"
                            : "border-ink-700 text-ink-500"
                    }
                  `}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
                {/* Tick / X icon */}
                {isCorrectAnswer && (
                  <svg
                    className='w-4 h-4 ml-auto text-forest-400 shrink-0'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
                {isWrongAnswer && (
                  <svg
                    className='w-4 h-4 ml-auto text-red-400 shrink-0'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestionHeader({
  number,
  total,
  type,
}: {
  number: number;
  total: number;
  type: string;
}) {
  return (
    <div className='flex items-center gap-3'>
      <span className='text-xs font-semibold text-ink-500 font-body uppercase tracking-widest'>
        {number} / {total}
      </span>
      <span className='w-px h-3 bg-ink-700' />
      <span className='text-xs text-ink-600 font-body'>{type}</span>
    </div>
  );
}
