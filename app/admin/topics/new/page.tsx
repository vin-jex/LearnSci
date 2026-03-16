"use client";
// app/admin/topics/new/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "@/components/auth/FormInput";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "e.g. 20 mins"),
  order: z.coerce.number().int().min(0).optional(),
});
type FormData = z.infer<typeof schema>;

export default function NewTopicPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    const res = await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setIsLoading(false);
    if (!res.ok) { setError(json.error ?? "Failed to create topic"); return; }
    router.push(`/admin/topics/${json.topic.id}`);
  };

  return (
    <div className="max-w-xl animate-fade-up">
      <div className="mb-8">
        <Link href="/admin/topics" className="text-xs text-ink-500 hover:text-ink-300 font-body
                                              flex items-center gap-1 mb-4 transition-colors">
          ← Back to Topics
        </Link>
        <p className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-1">Admin</p>
        <h1 className="font-display text-4xl text-ink-100">New Topic</h1>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/5">
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20
                          text-red-400 text-sm font-body">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormInput label="Topic Title" placeholder="e.g. Photosynthesis"
            error={errors.title?.message} {...register("title")} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-ink-400">
              Description
            </label>
            <textarea
              placeholder="Short description shown on the topic card…"
              rows={3}
              className="input-field resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>
          <FormInput label="Estimated Duration" placeholder="e.g. 20 mins"
            error={errors.duration?.message} {...register("duration")} />
          <FormInput label="Order (display sequence)" type="number" placeholder="1"
            error={errors.order?.message} {...register("order")} />

          <button type="submit" disabled={isLoading}
            className="btn-primary flex items-center justify-center gap-2 mt-2">
            {isLoading ? <><div className="spinner" />Creating…</> : "Create Topic →"}
          </button>
        </form>
      </div>
    </div>
  );
}
