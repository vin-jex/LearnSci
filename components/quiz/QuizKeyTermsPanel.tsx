"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { toggleIgbo } from "@/lib/store/slices/igboSlice";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface KeyTerm {
  id: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string | null;
}

interface Props {
  keyTerms: KeyTerm[];
}

export function QuizKeyTermsPanel({ keyTerms }: Props) {
  const dispatch = useAppDispatch();
  const isIgboVisible = useAppSelector((s) => s.igbo.isVisible);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (keyTerms.length === 0) return null;

  return (
    <div className='glass-card rounded-2xl border border-white/5 overflow-hidden'>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className='w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors duration-150'
      >
        <div className='flex items-center gap-2.5'>
          <div className='w-6 h-6 rounded-md bg-forest-600/20 border border-forest-500/20 flex items-center justify-center shrink-0'>
            <svg
              className='w-3 h-3 text-forest-400'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 2-1 3-4 3-4S9.5 3 7.5 8c0 0 .5-3 3-4C10.5 4 4 5 4 11c0 2.5 1 4.5 2 6L8 16c3.15-3.37 9.17-3.5 9-8z' />
            </svg>
          </div>
          <span className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
            {t("lesson.keyTerms")}
          </span>
          <span className='text-xs text-ink-600 font-body'>
            ({keyTerms.length})
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleIgbo());
            }}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold
              font-body transition-all duration-200 border
              ${
                isIgboVisible
                  ? "bg-earth-400/15 border-earth-400/30 text-earth-300"
                  : "bg-ink-900/60 border-ink-700 text-ink-500 hover:text-ink-300"
              }
            `}
          >
            <span className='flex items-center gap-0.5'>
              <span className='w-1.5 h-2.5 rounded-sm bg-forest-600 opacity-80' />
              <span className='w-1.5 h-2.5 rounded-sm bg-white opacity-30' />
              <span className='w-1.5 h-2.5 rounded-sm bg-forest-600 opacity-80' />
            </span>
            {isIgboVisible ? t("lesson.igboOn") : t("lesson.igboOff")}
          </button>

          <svg
            className={`w-4 h-4 text-ink-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className='px-4 pb-4 space-y-2 border-t border-white/5 pt-3 max-h-[460px] overflow-y-auto'>
          {keyTerms.map((term) => (
            <div
              key={term.id}
              className={`
                rounded-xl border px-3 py-2.5 transition-all duration-200
                ${
                  isIgboVisible
                    ? "bg-earth-400/5 border-earth-400/15"
                    : "bg-ink-900/40 border-ink-800"
                }
              `}
            >
              <p className='text-sm font-semibold text-ink-200 font-body'>
                {term.englishTerm}
              </p>

              <div
                className={`
                  overflow-hidden transition-all duration-300
                  ${isIgboVisible ? "max-h-32 opacity-100 mt-1" : "max-h-0 opacity-0"}
                `}
              >
                <p className='text-sm text-earth-300 font-body font-medium'>
                  {term.igboTerm}
                </p>

                {term.igboExplanation && (
                  <>
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === term.id ? null : term.id)
                      }
                      className='mt-1 text-xs text-ink-500 hover:text-earth-400 transition-colors flex items-center gap-1 font-body'
                    >
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${expandedId === term.id ? "rotate-90" : ""}`}
                        viewBox='0 0 12 12'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                      >
                        <path d='M4 2l4 4-4 4' />
                      </svg>
                      {expandedId === term.id ? t("lesson.hideExplanation") : t("lesson.showExplanation")}
                    </button>

                    <div
                      className={`
                        overflow-hidden transition-all duration-300
                        ${
                          expandedId === term.id
                            ? "max-h-24 opacity-100 mt-1"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <p className='text-xs text-ink-400 font-body italic leading-relaxed'>
                        {term.igboExplanation}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
