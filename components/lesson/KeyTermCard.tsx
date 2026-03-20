"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";

interface Props {
  englishTerm: string;
  igboTerm: string;
  igboExplanation?: string | null;
}

export function KeyTermCard({ englishTerm, igboTerm, igboExplanation }: Props) {
  const isIgboVisible = useAppSelector((s) => s.igbo.isVisible);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`
        rounded-xl border transition-all duration-200
        ${
          isIgboVisible
            ? "bg-earth-400/5 border-earth-400/15"
            : "bg-ink-900/40 border-ink-800"
        }
        p-3
      `}
    >
      {/* English term */}
      <p className='text-sm font-semibold text-ink-200 font-body'>
        {englishTerm}
      </p>

      {/* Igbo term (shown when toggle is ON) */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isIgboVisible ? "max-h-40 opacity-100 mt-1.5" : "max-h-0 opacity-0"}
        `}
      >
        <p className='text-sm text-earth-300 font-body font-medium'>
          {igboTerm}
        </p>

        {/* Igbo explanation (expandable tooltip) */}
        {igboExplanation && (
          <>
            <button
              onClick={() => setExpanded((e) => !e)}
              className='mt-1 text-xs text-ink-500 hover:text-earth-400 transition-colors
                         flex items-center gap-1 font-body'
            >
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                viewBox='0 0 12 12'
                fill='currentColor'
              >
                <path
                  d='M4 2l4 4-4 4'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill='none'
                />
              </svg>
              {expanded ? "Hide explanation" : "Nkọwa"}
            </button>
            <div
              className={`
                overflow-hidden transition-all duration-300
                ${expanded ? "max-h-24 opacity-100 mt-1" : "max-h-0 opacity-0"}
              `}
            >
              <p className='text-xs text-ink-400 font-body italic leading-relaxed'>
                {igboExplanation}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
