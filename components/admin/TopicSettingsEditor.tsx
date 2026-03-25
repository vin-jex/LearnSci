"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "@/components/auth/FormInput";

const schema = z.object({
  title: z.string().min(2),
  titleIgbo: z.string().optional(),
  description: z.string().min(10),
  descriptionIgbo: z.string().optional(),
  duration: z.string().min(1),
  order: z.coerce.number().int().min(0),
  published: z.boolean(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  topic: {
    id: string;
    title: string;
    titleIgbo?: string;
    description: string;
    descriptionIgbo?: string;
    duration: string;
    order: number;
    published: boolean;
  };
  onSaved: () => void;
}

export function TopicSettingsEditor({ topic, onSaved }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: topic.title,
      titleIgbo: topic.titleIgbo ?? "",
      description: topic.description,
      descriptionIgbo: topic.descriptionIgbo ?? "",
      duration: topic.duration,
      order: topic.order,
      published: topic.published,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);
    setSaved(false);
    const res = await fetch(`/api/admin/topics/${topic.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setIsSaving(false);
    if (!res.ok) {
      const j = await res.json();
      setError(j.error);
      return;
    }
    setSaved(true);
    onSaved();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className='max-w-xl'>
      <div className='glass-card rounded-2xl p-6 border border-white/5'>
        {error && (
          <div className='mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body'>
            {error}
          </div>
        )}
        {saved && (
          <div className='mb-4 px-4 py-3 rounded-xl bg-forest-500/10 border border-forest-500/20 text-forest-400 text-sm font-body'>
            ✓ Changes saved
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5'
          noValidate
        >
          {/* English fields */}
          <div className='space-y-4'>
            <p className='text-xs font-semibold uppercase tracking-widest text-ink-600'>
              English
            </p>
            <FormInput
              label='Title'
              error={errors.title?.message}
              {...register("title")}
            />
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Description
              </label>
              <textarea
                rows={3}
                className='input-field resize-none'
                {...register("description")}
              />
              {errors.description && (
                <p className='text-xs text-red-400'>
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Igbo fields */}
          <div className='space-y-4 pt-4 border-t border-earth-400/15'>
            <div className='flex items-center gap-2'>
              <span className='flex items-center gap-0.5'>
                <span className='w-2 h-3 rounded-sm bg-forest-600 opacity-80' />
                <span className='w-2 h-3 rounded-sm bg-white opacity-30' />
                <span className='w-2 h-3 rounded-sm bg-forest-600 opacity-80' />
              </span>
              <p className='text-xs font-semibold uppercase tracking-widest text-earth-500'>
                Igbo
              </p>
            </div>
            <FormInput
              label='Isiokwu (Title - Igbo)'
              placeholder='Igbo title…'
              error={errors.titleIgbo?.message}
              {...register("titleIgbo")}
            />
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-semibold uppercase tracking-widest text-ink-400'>
                Nkọwa (Description - Igbo)
              </label>
              <textarea
                rows={3}
                className='input-field resize-none'
                placeholder='Igbo description…'
                {...register("descriptionIgbo")}
              />
            </div>
          </div>

          {/* Meta */}
          <div className='space-y-4 pt-4 border-t border-white/5'>
            <FormInput
              label='Duration'
              placeholder='e.g. 20 mins'
              error={errors.duration?.message}
              {...register("duration")}
            />
            <FormInput
              label='Order'
              type='number'
              error={errors.order?.message}
              {...register("order")}
            />
          </div>

          {/* Published toggle */}
          <div className='flex items-center justify-between py-3 border-t border-white/5'>
            <div>
              <p className='text-sm font-semibold text-ink-200 font-body'>
                Published
              </p>
              <p className='text-xs text-ink-500 font-body'>
                Learners can see published topics on their dashboard.
              </p>
            </div>
            <label className='relative inline-flex cursor-pointer'>
              <input
                type='checkbox'
                className='sr-only peer'
                {...register("published")}
              />
              <div className="w-11 h-6 bg-ink-700 rounded-full peer peer-checked:bg-forest-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>

          <button
            type='submit'
            disabled={isSaving}
            className='btn-primary flex items-center justify-center gap-2'
          >
            {isSaving ? (
              <>
                <div className='spinner' />
                Saving…
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
