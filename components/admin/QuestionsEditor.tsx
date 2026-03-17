"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";

interface Question {
  id: string;
  type: string;
  questionText: string;
  options: string[] | null;
  correctAnswer: string;
  feedbackRules: {
    misconceptions: { pattern: string; feedback: string }[];
    defaultFeedback: string;
  };
}

interface KeyTerm {
  id: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation: string | null;
}

interface Props {
  topicId: string;
  questions: Question[];
  keyTerms?: KeyTerm[];
  onSaved: () => void;
}

const misconceptionSchema = z.object({
  pattern: z.string().min(1, "Pattern required"),
  feedback: z.string().min(1, "Feedback required"),
});

const questionSchema = z.object({
  type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
  questionText: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty")).optional(),
  correctAnswer: z.string().min(1, "Correct answer is required"),
  defaultFeedback: z.string().min(1, "Default feedback is required"),
  misconceptions: z.array(misconceptionSchema),
});

type FormData = z.infer<typeof questionSchema>;

const TYPE_LABELS: Record<QuestionType, string> = {
  MCQ: "Multiple Choice",
  TRUE_FALSE: "True / False",
  SHORT_ANSWER: "Short Answer",
};

export function QuestionsEditor({
  topicId,
  questions,
  keyTerms = [],
  onSaved,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: "MCQ",
      misconceptions: [],
      options: ["", "", "", ""],
    },
  });

  const {
    fields: misconceptionFields,
    append: addMisconception,
    remove: removeMisconception,
  } = useFieldArray({ control, name: "misconceptions" });

  const questionType = watch("type");

  const handleTypeChange = (type: QuestionType) => {
    setValue("type", type);
    setValue("correctAnswer", "");
    if (type === "MCQ") setValue("options", ["", "", "", ""]);
    else if (type === "TRUE_FALSE") setValue("options", ["True", "False"]);
    else setValue("options", undefined);
  };

  const onSubmit = async (data: FormData) => {
    setIsAdding(true);
    setError(null);

    const payload = {
      type: data.type,
      questionText: data.questionText,
      options:
        data.type === "MCQ"
          ? data.options?.filter(Boolean)
          : data.type === "TRUE_FALSE"
            ? ["True", "False"]
            : null,
      correctAnswer: data.correctAnswer,
      feedbackRules: {
        misconceptions: data.misconceptions,
        defaultFeedback: data.defaultFeedback,
      },
    };

    const res = await fetch(`/api/admin/topics/${topicId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsAdding(false);
    if (!res.ok) {
      const j = await res.json();
      setError(j.error ?? "Failed to save question");
      return;
    }

    reset({
      type: "MCQ",
      misconceptions: [],
      options: ["", "", "", ""],
      questionText: "",
      correctAnswer: "",
      defaultFeedback: "",
    });
    setSaved(true);
    setShowForm(false);
    onSaved();
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = async (qid: string) => {
    if (!confirm("Delete this question?")) return;
    setDeletingId(qid);
    await fetch(`/api/admin/topics/${topicId}/questions/${qid}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    onSaved();
  };

  return (
    <div className='space-y-6'>
      {keyTerms.length > 0 && (
        <div className='glass-card rounded-2xl border border-earth-400/15 overflow-hidden'>
          <button
            onClick={() => setTermsOpen((o) => !o)}
            className='w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors'
          >
            <div className='flex items-center gap-2'>
              <span className='text-xs font-semibold uppercase tracking-widest text-earth-500'>
                Igbo Key Terms Reference
              </span>
              <span className='text-xs text-ink-600 font-body'>
                ({keyTerms.length} terms)
              </span>
              <span className='text-xs text-ink-700 font-body italic'>
                - use these when writing feedback
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-ink-600 transition-transform duration-200 ${termsOpen ? "rotate-180" : ""}`}
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>

          <div
            className={`
              overflow-hidden transition-all duration-300
              ${termsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className='px-5 pb-4 pt-2 border-t border-white/5'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto'>
                {keyTerms.map((term) => (
                  <div
                    key={term.id}
                    className='bg-ink-900/40 border border-ink-800 rounded-xl px-3 py-2'
                  >
                    <p className='text-xs font-semibold text-ink-200 font-body'>
                      {term.englishTerm}
                    </p>
                    <p className='text-xs text-earth-400 font-body'>
                      {term.igboTerm}
                    </p>
                    {term.igboExplanation && (
                      <p className='text-xs text-ink-600 font-body italic mt-0.5 leading-relaxed'>
                        {term.igboExplanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className='px-4 py-3 rounded-xl bg-forest-500/10 border border-forest-500/20 text-forest-400 text-sm font-body animate-fade-in'>
          ✓ Question saved successfully
        </div>
      )}

      <div>
        <div className='flex items-center justify-between mb-3'>
          <p className='text-xs font-semibold uppercase tracking-widest text-ink-500'>
            Questions ({questions.length})
          </p>
          <button
            onClick={() => setShowForm((s) => !s)}
            className='flex items-center gap-1.5 text-xs font-semibold font-body bg-earth-500/90 hover:bg-earth-400 text-white px-3 py-1.5 rounded-lg transition-colors'
          >
            {showForm ? "✕ Cancel" : "+ Add Question"}
          </button>
        </div>

        {questions.length === 0 && !showForm ? (
          <div className='glass-card rounded-2xl p-8 border border-white/5 text-center'>
            <p className='text-ink-500 font-body text-sm mb-2'>
              No questions yet.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='text-xs text-earth-400 underline underline-offset-2 font-body'
            >
              Add your first question
            </button>
          </div>
        ) : (
          <div className='space-y-3'>
            {questions.map((q, i) => (
              <div
                key={q.id}
                className='glass-card rounded-xl border border-white/5 px-5 py-4'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1.5 flex-wrap'>
                      <span className='text-xs font-body text-ink-600'>
                        Q{i + 1}
                      </span>
                      <span
                        className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full border
                          ${
                            q.type === "MCQ"
                              ? "text-forest-400 bg-forest-500/10 border-forest-500/20"
                              : q.type === "TRUE_FALSE"
                                ? "text-earth-400 bg-earth-400/10 border-earth-400/20"
                                : "text-ink-300 bg-ink-800 border-ink-700"
                          }`}
                      >
                        {TYPE_LABELS[q.type as QuestionType]}
                      </span>
                    </div>
                    <p className='text-sm text-ink-200 font-body leading-snug'>
                      {q.questionText}
                    </p>
                    <p className='text-xs text-ink-500 font-body mt-1'>
                      Answer:{" "}
                      <span className='text-forest-400 font-semibold'>
                        {q.correctAnswer}
                      </span>
                      {q.feedbackRules.misconceptions?.length > 0 && (
                        <span className='ml-3 text-ink-600'>
                          {q.feedbackRules.misconceptions?.length} misconception
                          rule
                          {q.feedbackRules.misconceptions?.length !== 1
                            ? "s"
                            : ""}
                        </span>
                      )}
                    </p>
                    {q.options && q.options?.length > 0 && (
                      <p className='text-xs text-ink-600 font-body mt-0.5'>
                        Options: {q.options.join(" · ")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(q.id)}
                    disabled={deletingId === q.id}
                    className='text-xs text-red-500 hover:text-red-400 font-body shrink-0 transition-colors disabled:opacity-40'
                  >
                    {deletingId === q.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className='glass-card rounded-2xl border border-earth-400/15 bg-earth-400/3 p-6'>
          <p className='text-xs font-semibold uppercase tracking-widest text-earth-500 mb-5'>
            New Question
          </p>

          {error && (
            <div className='mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body'>
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-5'
            noValidate
          >
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Question Type
              </label>
              <div className='flex gap-2 flex-wrap'>
                {(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"] as QuestionType[]).map(
                  (t) => (
                    <button
                      key={t}
                      type='button'
                      onClick={() => handleTypeChange(t)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold font-body border transition-colors
                      ${
                        questionType === t
                          ? "bg-earth-400/15 border-earth-400/30 text-earth-300"
                          : "border-ink-700 text-ink-500 hover:border-ink-600 hover:text-ink-300"
                      }`}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Question Text
              </label>
              <textarea
                rows={2}
                placeholder='e.g. Where does photosynthesis primarily take place?'
                className={`input-field resize-none ${errors.questionText ? "error" : ""}`}
                {...register("questionText")}
              />
              {errors.questionText && (
                <p className='text-xs text-red-400'>
                  {errors.questionText.message}
                </p>
              )}
            </div>

            {questionType === "MCQ" && (
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                  Answer Options
                </label>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <span className='text-xs text-ink-600 font-body w-5 shrink-0'>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <input
                      className='input-field'
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      {...register(`options.${i}` as const)}
                    />
                  </div>
                ))}
                {errors.options && (
                  <p className='text-xs text-red-400'>
                    All options must be filled
                  </p>
                )}
              </div>
            )}

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Correct Answer
              </label>
              {questionType === "TRUE_FALSE" ? (
                <div className='flex gap-2'>
                  {["True", "False"].map((opt) => (
                    <label
                      key={opt}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <input
                        type='radio'
                        value={opt}
                        className='accent-forest-500'
                        {...register("correctAnswer")}
                      />
                      <span className='text-sm text-ink-300 font-body'>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  className={`input-field ${errors.correctAnswer ? "error" : ""}`}
                  placeholder={
                    questionType === "MCQ"
                      ? "Must match one option exactly"
                      : "e.g. chlorophyll"
                  }
                  {...register("correctAnswer")}
                />
              )}
              {errors.correctAnswer && (
                <p className='text-xs text-red-400'>
                  {errors.correctAnswer.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Default Feedback
                <span className='ml-1 text-ink-600 font-normal normal-case'>
                  (shown when wrong answer doesn&apos;t match a misconception)
                </span>
              </label>
              <textarea
                rows={2}
                className={`input-field resize-none ${errors.defaultFeedback ? "error" : ""}`}
                placeholder='e.g. Photosynthesis takes place in the chloroplast, not the mitochondria.'
                {...register("defaultFeedback")}
              />
              {errors.defaultFeedback && (
                <p className='text-xs text-red-400'>
                  {errors.defaultFeedback.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                  Misconception Rules
                  <span className='ml-1 text-ink-600 font-normal normal-case'>
                    (optional - targeted feedback for common wrong answers)
                  </span>
                </label>
                <button
                  type='button'
                  onClick={() =>
                    addMisconception({ pattern: "", feedback: "" })
                  }
                  className='text-xs text-earth-400 hover:text-earth-300 font-body border border-earth-400/30 px-2.5 py-1 rounded-lg transition-colors'
                >
                  + Add Rule
                </button>
              </div>

              {misconceptionFields.length === 0 && (
                <p className='text-xs text-ink-600 font-body italic'>
                  No misconception rules yet. Add one to give targeted feedback.
                </p>
              )}

              {misconceptionFields.map((field, idx) => (
                <div
                  key={field.id}
                  className='bg-ink-900/40 border border-ink-800 rounded-xl p-4 space-y-3'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-ink-500 font-body font-semibold'>
                      Rule {idx + 1}
                    </span>
                    <button
                      type='button'
                      onClick={() => removeMisconception(idx)}
                      className='text-xs text-red-500 hover:text-red-400 font-body transition-colors'
                    >
                      Remove
                    </button>
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs text-ink-500 font-body'>
                      Pattern (wrong answer text to match)
                    </label>
                    <input
                      className={`input-field ${
                        errors.misconceptions?.[idx]?.pattern ? "error" : ""
                      }`}
                      placeholder='e.g. Mitochondria'
                      {...register(`misconceptions.${idx}.pattern`)}
                    />
                    {errors.misconceptions?.[idx]?.pattern && (
                      <p className='text-xs text-red-400'>
                        {errors.misconceptions[idx]?.pattern?.message}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-xs text-ink-500 font-body'>
                      Targeted feedback for this misconception
                    </label>
                    <textarea
                      rows={2}
                      className={`input-field resize-none ${
                        errors.misconceptions?.[idx]?.feedback ? "error" : ""
                      }`}
                      placeholder='e.g. Mitochondria is where respiration occurs. Photosynthesis happens in the chloroplast.'
                      {...register(`misconceptions.${idx}.feedback`)}
                    />
                    {errors.misconceptions?.[idx]?.feedback && (
                      <p className='text-xs text-red-400'>
                        {errors.misconceptions[idx]?.feedback?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='flex items-center justify-end gap-3 pt-2 border-t border-white/5'>
              <button
                type='button'
                onClick={() => {
                  setShowForm(false);
                  reset();
                  setError(null);
                }}
                className='text-sm text-ink-500 hover:text-ink-300 font-body transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isAdding}
                className='btn-primary !w-auto px-6 flex items-center gap-2'
              >
                {isAdding ? (
                  <>
                    <div className='spinner' />
                    Saving…
                  </>
                ) : (
                  "Save Question"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
