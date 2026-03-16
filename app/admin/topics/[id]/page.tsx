"use client";
// app/admin/topics/[id]/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { LessonEditor } from "@/components/admin/LessonEditor";
import { KeyTermsEditor } from "@/components/admin/KeyTermsEditor";
import { QuestionsEditor } from "@/components/admin/QuestionsEditor";
import { TopicSettingsEditor } from "@/components/admin/TopicSettingsEditor";

type Tab = "settings" | "lesson" | "terms" | "questions";

interface TopicFull {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  published: boolean;
  lessons: { id: string; content: string; order: number }[];
  keyTerms: { id: string; englishTerm: string; igboTerm: string; igboExplanation: string | null }[];
  questions: {
    id: string;
    type: string;
    questionText: string;
    options: string[] | null;
    correctAnswer: string;
    feedbackRules: { misconceptions: { pattern: string; feedback: string }[]; defaultFeedback: string };
  }[];
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "settings", label: "Settings", icon: "⚙️" },
  { key: "lesson", label: "Lesson", icon: "📄" },
  { key: "terms", label: "Key Terms", icon: "🌿" },
  { key: "questions", label: "Questions", icon: "❓" },
];

export default function AdminTopicPage({ params }: { params: { id: string } }) {
  const [topic, setTopic] = useState<TopicFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("settings");

  const load = () => {
    setIsLoading(true);
    fetch(`/api/admin/topics/${params.id}`)
      .then((r) => r.json())
      .then((d) => setTopic(d.topic))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, [params.id]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-ink-900 rounded" />
        <div className="h-12 w-96 bg-ink-900 rounded" />
        <div className="h-96 bg-ink-900 rounded-2xl" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-24">
        <p className="text-ink-400 font-body">Topic not found.</p>
        <Link href="/admin/topics" className="text-sm text-earth-400 underline mt-2 inline-block font-body">
          Back to Topics
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/topics"
          className="text-xs text-ink-500 hover:text-ink-300 font-body flex items-center gap-1 mb-4 transition-colors">
          ← All Topics
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-earth-500 mb-1">Editing</p>
            <h1 className="font-display text-3xl text-ink-100">{topic.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${
              topic.published
                ? "text-forest-400 bg-forest-500/10 border-forest-500/20"
                : "text-ink-500 bg-ink-900 border-ink-700"
            }`}>
              {topic.published ? "Published" : "Draft"}
            </span>
            <Link href={`/topic/${topic.id}`} target="_blank"
              className="text-xs text-ink-500 hover:text-ink-300 font-body transition-colors
                         border border-ink-700 px-3 py-1.5 rounded-lg hover:border-ink-600">
              Preview ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/5 pb-0">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 text-sm font-body font-semibold rounded-t-lg
                        transition-colors relative -mb-px border-b-2
              ${activeTab === key
                ? "text-earth-300 border-earth-400"
                : "text-ink-500 border-transparent hover:text-ink-300"
              }`}
          >
            <span className="mr-1.5">{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "settings" && (
          <TopicSettingsEditor topic={topic} onSaved={load} />
        )}
        {activeTab === "lesson" && (
          <LessonEditor topicId={topic.id} lessons={topic.lessons} onSaved={load} />
        )}
        {activeTab === "terms" && (
          <KeyTermsEditor topicId={topic.id} terms={topic.keyTerms} onSaved={load} />
        )}
        {activeTab === "questions" && (
          <QuestionsEditor topicId={topic.id} questions={topic.questions} onSaved={load} />
        )}
      </div>
    </div>
  );
}
