"use client";
import Link from "next/link";
import { KeyTermCard } from "./KeyTermCard";

interface KeyTerm {
  id: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string | null;
}

interface Props {
  keyTerms: KeyTerm[];
  topicId: string;
  questionCount: number;
  lastScore?: number | null;
}

export function KeyTermsPanel({
  keyTerms,
  topicId,
  questionCount,
  lastScore,
}: Props) {
  return (
    <aside className='flex flex-col gap-5'>
      <div className='glass-card rounded-2xl p-4 border border-white/5'>
        <p className='text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3'>
          Key Terms
          <span className='ml-2 text-ink-600 normal-case tracking-normal font-normal'>
            ({keyTerms.length})
          </span>
        </p>

        {keyTerms.length === 0 ? (
          <p className='text-xs text-ink-600 font-body italic'>
            No key terms for this topic yet.
          </p>
        ) : (
          <div className='flex flex-col gap-2'>
            {keyTerms.map((term) => (
              <KeyTermCard key={term.id} {...term} />
            ))}
          </div>
        )}
      </div>

      <div className='glass-card rounded-2xl p-4 border border-forest-500/15 bg-forest-500/3'>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-600 mb-1'>
          Ready to test yourself?
        </p>
        <p className='text-xs text-ink-500 font-body mb-3'>
          {questionCount} question{questionCount !== 1 ? "s" : ""} · Multiple
          types
        </p>

        {lastScore != null && (
          <p className='text-xs text-ink-500 font-body mb-3'>
            Last score:{" "}
            <span
              className={`font-semibold ${
                lastScore >= 80
                  ? "text-forest-400"
                  : lastScore >= 50
                    ? "text-earth-400"
                    : "text-red-400"
              }`}
            >
              {Math.round(lastScore)}%
            </span>
          </p>
        )}

        <Link
          href={`/quiz/${topicId}`}
          className='block w-full text-center text-sm font-semibold font-body bg-forest-600 hover:bg-forest-500 text-white py-2.5 rounded-xl transition-colors duration-200'
        >
          Start Quiz →
        </Link>
      </div>
    </aside>
  );
}
