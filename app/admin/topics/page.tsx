"use client";
// app/admin/topics/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";

interface TopicAdmin {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  published: boolean;
  _count: { lessons: number; keyTerms: number; questions: number; attempts: number };
}

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<TopicAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    fetch("/api/admin/topics")
      .then((r) => r.json())
      .then((d) => setTopics(d.topics ?? []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleTogglePublish = async (topic: TopicAdmin) => {
    await fetch(`/api/admin/topics/${topic.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !topic.published }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this topic and all its content? This cannot be undone.")) return;
    setDeletingId(id);
    await fetch(`/api/admin/topics/${id}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-1">Admin</p>
          <h1 className="font-display text-4xl text-ink-100">Topics</h1>
          <p className="text-ink-500 font-body text-sm mt-1">
            Manage science topics, lessons, key terms, and quiz questions.
          </p>
        </div>
        <Link
          href="/admin/topics/new"
          className="flex items-center gap-2 bg-earth-500 hover:bg-earth-400 text-white
                     text-sm font-semibold font-body px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          New Topic
        </Link>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-ink-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 border border-white/5 text-center">
          <p className="text-ink-400 font-body mb-3">No topics yet.</p>
          <Link href="/admin/topics/new"
            className="text-sm text-earth-400 underline underline-offset-2 font-body">
            Create your first topic →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="glass-card rounded-2xl border border-white/5 px-5 py-4
                         hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Order badge */}
                <span className="w-7 h-7 shrink-0 rounded-lg bg-ink-800 border border-ink-700
                                 flex items-center justify-center text-xs text-ink-500 font-body">
                  {topic.order}
                </span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-lg text-ink-100 truncate">{topic.title}</h3>
                    <span
                      className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full border ${
                        topic.published
                          ? "text-forest-400 bg-forest-500/10 border-forest-500/20"
                          : "text-ink-500 bg-ink-900 border-ink-700"
                      }`}
                    >
                      {topic.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-ink-600 font-body">
                    <span>{topic._count.lessons} lesson{topic._count.lessons !== 1 ? "s" : ""}</span>
                    <span>{topic._count.keyTerms} terms</span>
                    <span>{topic._count.questions} questions</span>
                    <span>{topic._count.attempts} attempts</span>
                    <span>{topic.duration}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(topic)}
                    className={`text-xs font-body px-3 py-1.5 rounded-lg border transition-colors ${
                      topic.published
                        ? "border-ink-700 text-ink-500 hover:text-red-400 hover:border-red-500/30"
                        : "border-forest-500/30 text-forest-400 hover:bg-forest-500/10"
                    }`}
                  >
                    {topic.published ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/admin/topics/${topic.id}`}
                    className="text-xs font-body px-3 py-1.5 rounded-lg border border-earth-400/30
                               text-earth-400 hover:bg-earth-400/10 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    disabled={deletingId === topic.id}
                    className="text-xs font-body px-3 py-1.5 rounded-lg border border-red-500/20
                               text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                  >
                    {deletingId === topic.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
