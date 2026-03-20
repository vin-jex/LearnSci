"use client";

import { useRef, useEffect } from "react";

interface Props {
  questionText: string;
  value: string;
  onChange: (val: string) => void;
  feedback: { isCorrect: boolean; feedback: string } | null;
  questionNumber: number;
  total: number;
}

export function ShortAnswerQuestion({
  questionText,
  value,
  onChange,
  feedback,
  questionNumber,
  total,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!feedback) inputRef.current?.focus();
  }, [feedback]);

  const showResult = feedback !== null;

  return (
    <div className='space-y-5'>
      <div className='flex items-center gap-3'>
        <span className='text-xs font-semibold text-ink-500 font-body uppercase tracking-widest'>
          {questionNumber} / {total}
        </span>
        <span className='w-px h-3 bg-ink-700' />
        <span className='text-xs text-ink-600 font-body'>Short Answer</span>
      </div>

      <p className='font-display text-xl text-ink-100 leading-snug'>
        {questionText}
      </p>

      <div className='relative'>
        <input
          ref={inputRef}
          type='text'
          value={value}
          onChange={(e) => !showResult && onChange(e.target.value)}
          disabled={showResult}
          placeholder='Type your answer here…'
          className={`
            w-full bg-ink-900/50 border rounded-xl px-4 py-3.5 text-sm font-body
            text-ink-100 placeholder-ink-600 outline-none transition-all duration-200
            ${
              showResult && feedback!.isCorrect
                ? "border-forest-500/50 bg-forest-500/5"
                : showResult && !feedback!.isCorrect
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-ink-700 focus:border-forest-500/50 focus:ring-2 focus:ring-forest-500/10"
            }
          `}
        />
        {showResult && (
          <span className='absolute right-3 top-1/2 -translate-y-1/2'>
            {feedback!.isCorrect ? (
              <svg
                className='w-5 h-5 text-forest-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                className='w-5 h-5 text-red-400'
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
        )}
      </div>

      <p className='text-xs text-ink-600 font-body'>
        Tip: Spelling matters. Be precise.
      </p>
    </div>
  );
}
