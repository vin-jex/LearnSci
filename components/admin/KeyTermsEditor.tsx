"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface KeyTerm {
  id: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string | null;
}

interface Props {
  topicId: string;
  terms: KeyTerm[];
  onSaved: () => void;
}

interface FormData {
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string;
}

export function KeyTermsEditor({ topicId, terms, onSaved }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [previewIgbo, setPreviewIgbo] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsAdding(true);
    setError(null);
    const res = await fetch(`/api/admin/topics/${topicId}/terms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setIsAdding(false);
    if (!res.ok) {
      const j = await res.json();
      setError(j.error);
      return;
    }
    reset();
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async (termId: string) => {
    setDeletingId(termId);
    await fetch(`/api/admin/topics/${topicId}/terms`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ termId }),
    });
    setDeletingId(null);
    onSaved();
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div>
        <div className='flex items-center justify-between mb-3'>
          <p className='text-xs font-semibold uppercase tracking-widest text-ink-500'>
            Existing Terms ({terms.length})
          </p>
          <button
            onClick={() => setPreviewIgbo((p) => !p)}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold
              font-body transition-all duration-200 border
              ${
                previewIgbo
                  ? "bg-earth-400/15 border-earth-400/30 text-earth-300 hover:bg-earth-400/20"
                  : "bg-ink-900/60 border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-300"
              }
            `}
            title='Preview how learners see this'
          >
            <span className='flex items-center gap-0.5'>
              <span className='w-2 h-3 rounded-sm bg-forest-600 opacity-80' />
              <span className='w-2 h-3 rounded-sm bg-white opacity-30' />
              <span className='w-2 h-3 rounded-sm bg-forest-600 opacity-80' />
            </span>
            {previewIgbo ? "Igbo: ON" : "Igbo: OFF"}
            <span
              className={`
                relative inline-flex w-7 h-4 rounded-full transition-colors duration-200
                ${previewIgbo ? "bg-earth-500" : "bg-ink-700"}
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200
                  ${previewIgbo ? "translate-x-3.5" : "translate-x-0.5"}
                `}
              />
            </span>
          </button>
        </div>

        {terms.length === 0 ? (
          <div className='glass-card rounded-2xl p-6 border border-white/5 text-center'>
            <p className='text-ink-600 font-body text-sm'>No key terms yet.</p>
          </div>
        ) : (
          <div className='space-y-2 max-h-[520px] overflow-y-auto pr-1'>
            {terms.map((term) => (
              <div
                key={term.id}
                className={`
                  rounded-xl border px-4 py-3 transition-all duration-200
                  flex items-start justify-between gap-3
                  ${
                    previewIgbo
                      ? "bg-earth-400/5 border-earth-400/15"
                      : "glass-card border-white/5"
                  }
                `}
              >
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-ink-200 font-body'>
                    {term.englishTerm}
                  </p>

                  <div
                    className={`
                      overflow-hidden transition-all duration-300
                      ${previewIgbo ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}
                    `}
                  >
                    <p className='text-sm text-earth-300 font-body font-medium'>
                      {term.igboTerm}
                    </p>

                    {term.igboExplanation && (
                      <>
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === term.id ? null : term.id,
                            )
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
                          {expandedId === term.id ? "Hide" : "Nkọwa"}
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

                  {!previewIgbo && (
                    <div className='mt-1 space-y-0.5'>
                      <p className='text-xs text-earth-400/70 font-body'>
                        {term.igboTerm}
                      </p>
                      {term.igboExplanation && (
                        <p className='text-xs text-ink-600 font-body italic'>
                          {term.igboExplanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(term.id)}
                  disabled={deletingId === term.id}
                  className='text-xs text-red-500 hover:text-red-400 font-body shrink-0 transition-colors disabled:opacity-40'
                >
                  {deletingId === term.id ? "…" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className='text-xs text-ink-700 font-body mt-3 italic'>
          Toggle &quot;Igbo: ON&quot; above to preview the learner experience.
        </p>
      </div>

      <div>
        <p className='text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3'>
          Add Key Term
        </p>
        <div className='glass-card rounded-2xl p-5 border border-white/5'>
          {error && (
            <div className='mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body'>
              {error}
            </div>
          )}
          {saved && (
            <div className='mb-4 px-3 py-2 rounded-lg bg-forest-500/10 border border-forest-500/20 text-forest-400 text-xs font-body'>
              ✓ Term added
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
            noValidate
          >
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                English Term
              </label>
              <input
                className={`input-field ${errors.englishTerm ? "error" : ""}`}
                placeholder='e.g. Photosynthesis'
                {...register("englishTerm", { required: "Required" })}
              />
              {errors.englishTerm && (
                <p className='text-xs text-red-400'>
                  {errors.englishTerm.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Igbo Term
              </label>
              <input
                className={`input-field ${errors.igboTerm ? "error" : ""}`}
                placeholder='e.g. Ọrụ Anyanwụ'
                {...register("igboTerm", { required: "Required" })}
              />
              {errors.igboTerm && (
                <p className='text-xs text-red-400'>
                  {errors.igboTerm.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Igbo Explanation{" "}
                <span className='text-ink-600 normal-case font-normal'>
                  (optional)
                </span>
              </label>
              <textarea
                rows={2}
                className='input-field resize-none'
                placeholder='Short explanation in Igbo…'
                {...register("igboExplanation")}
              />
            </div>

            <button
              type='submit'
              disabled={isAdding}
              className='btn-primary flex items-center justify-center gap-2'
            >
              {isAdding ? (
                <>
                  <div className='spinner' />
                  Adding…
                </>
              ) : (
                "+ Add Term"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
