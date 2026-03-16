"use client";
// components/admin/KeyTermsEditor.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";

interface KeyTerm { id: string; englishTerm: string; igboTerm: string; igboExplanation: string | null; }
interface Props { topicId: string; terms: KeyTerm[]; onSaved: () => void; }

interface FormData { englishTerm: string; igboTerm: string; igboExplanation: string; }

export function KeyTermsEditor({ topicId, terms, onSaved }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsAdding(true); setError(null);
    const res = await fetch(`/api/admin/topics/${topicId}/terms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setIsAdding(false);
    if (!res.ok) { const j = await res.json(); setError(j.error); return; }
    reset(); setSaved(true); onSaved();
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Existing terms */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3">
          Existing Terms ({terms.length})
        </p>
        {terms.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
            <p className="text-ink-600 font-body text-sm">No key terms yet.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {terms.map((t) => (
              <div key={t.id}
                className="glass-card rounded-xl px-4 py-3 border border-white/5
                           flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-200 font-body">{t.englishTerm}</p>
                  <p className="text-sm text-earth-300 font-body">{t.igboTerm}</p>
                  {t.igboExplanation && (
                    <p className="text-xs text-ink-500 font-body italic mt-0.5 leading-relaxed">
                      {t.igboExplanation}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="text-xs text-red-500 hover:text-red-400 font-body shrink-0
                             transition-colors disabled:opacity-40"
                >
                  {deletingId === t.id ? "…" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new term */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3">
          Add Key Term
        </p>
        <div className="glass-card rounded-2xl p-5 border border-white/5">
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20
                            text-red-400 text-xs font-body">{error}</div>
          )}
          {saved && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-forest-500/10 border border-forest-500/20
                            text-forest-400 text-xs font-body">✓ Term added</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                English Term
              </label>
              <input
                className={`input-field ${errors.englishTerm ? "error" : ""}`}
                placeholder="e.g. Photosynthesis"
                {...register("englishTerm", { required: "Required" })}
              />
              {errors.englishTerm && <p className="text-xs text-red-400">{errors.englishTerm.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Igbo Term
              </label>
              <input
                className={`input-field ${errors.igboTerm ? "error" : ""}`}
                placeholder="e.g. Ọrụ Anyanwụ"
                {...register("igboTerm", { required: "Required" })}
              />
              {errors.igboTerm && <p className="text-xs text-red-400">{errors.igboTerm.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                Igbo Explanation <span className="text-ink-600 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                className="input-field resize-none"
                placeholder="Short explanation in Igbo…"
                {...register("igboExplanation")}
              />
            </div>

            <button type="submit" disabled={isAdding}
              className="btn-primary flex items-center justify-center gap-2">
              {isAdding ? <><div className="spinner" />Adding…</> : "+ Add Term"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
