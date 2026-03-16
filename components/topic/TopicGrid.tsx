"use client";
// components/topic/TopicGrid.tsx
import { useTopics } from "@/lib/hooks/useTopics";
import { TopicCard } from "./TopicCard";

export function TopicGrid() {
  const { topics, isLoading, error } = useTopics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-52 rounded-2xl bg-ink-900 animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-500 font-body text-sm">{error}</p>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="py-16 text-center glass-card rounded-2xl border border-white/5">
        <p className="text-ink-400 font-body">No topics available yet.</p>
        <p className="text-ink-600 text-sm mt-1 font-body">
          Check back soon or ask your instructor.
        </p>
      </div>
    );
  }

  // Split by status
  const inProgress = topics.filter((t) => t.status === "IN_PROGRESS");
  const notStarted = topics.filter((t) => t.status === "NOT_STARTED");
  const completed = topics.filter((t) => t.status === "COMPLETED");

  const sections: { label: string; items: typeof topics }[] = [
    ...(inProgress.length > 0 ? [{ label: "Continue Learning", items: inProgress }] : []),
    ...(notStarted.length > 0 ? [{ label: "Available Topics", items: notStarted }] : []),
    ...(completed.length > 0 ? [{ label: "Completed", items: completed }] : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      {sections.map(({ label, items }) => (
        <section key={label}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3">
            {label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((topic, i) => (
              <div
                key={topic.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <TopicCard topic={topic} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
