"use client";
import { useState } from "react";

interface GeneratedQuestion {
  id: string;
  type: string;
  questionText: string;
  correctAnswer: string;
}

interface Props {
  topicId: string;
  onGenerated: () => void;
}

export function QuestionGeneratorPanel({ topicId, onGenerated }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [count, setCount] = useState(5);
  const [generated, setGenerated] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGenerated([]);
    try {
      const res = await fetch(
        `/api/admin/topics/${topicId}/generate-questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setGenerated(data.questions);
      onGenerated();
    } catch {
      setError("Generation failed. Check your HuggingFace API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='glass-card rounded-2xl p-5 border border-forest-500/20 bg-forest-500/3 space-y-4'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
          AI Question Generator
        </p>
        <p className='text-xs text-ink-500 font-body leading-relaxed'>
          Generate quiz questions automatically from the lesson content using
          Mistral-7B. Questions are saved as drafts — review and edit them in
          the Questions tab above.
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          <label className='text-xs text-ink-500 font-body'>Questions:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className='bg-ink-900 border border-ink-700 text-ink-200 text-xs rounded-lg px-2 py-1.5 font-body focus:outline-none focus:border-forest-500/50'
          >
            {[3, 5, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className='flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-500 text-white text-xs font-semibold font-body transition-colors disabled:opacity-50'
        >
          {isGenerating ? (
            <>
              <div className='spinner !w-3 !h-3' />
              Generating…
            </>
          ) : (
            <>
              <svg
                className='w-3.5 h-3.5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
              </svg>
              Generate {count} Questions
            </>
          )}
        </button>
      </div>

      {error && (
        <div className='px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body'>
          {error}
        </div>
      )}

      {generated.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-semibold text-forest-400 font-body'>
            ✓ {generated.length} questions generated and saved as drafts
          </p>
          <div className='space-y-1 max-h-40 overflow-y-auto'>
            {generated.map((q, i) => (
              <div
                key={q.id}
                className='flex items-start gap-2 text-xs font-body text-ink-500'
              >
                <span className='text-forest-600 shrink-0'>{i + 1}.</span>
                <span className='line-clamp-1'>{q.questionText}</span>
                <span className='shrink-0 px-1.5 py-0.5 rounded text-xs bg-ink-800 text-ink-600 border border-ink-700'>
                  {q.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
