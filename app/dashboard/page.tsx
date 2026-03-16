// app/dashboard/page.tsx - updated Phase 3
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TopicGrid } from "@/components/topic/TopicGrid";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0] ?? "Learner";

  return (
    <div className='animate-fade-up stagger'>
      {/* Greeting */}
      <div className='mb-10 animate-fade-up'>
        <p className='text-xs font-semibold uppercase tracking-widest text-forest-500 mb-1'>
          Dashboard
        </p>
        <h1 className='font-display text-4xl text-ink-100'>
          Welcome back, {firstName} 👋
        </h1>
        <p className='text-ink-400 font-body mt-2 max-w-xl'>
          Continue where you left off, or explore a new topic. Each lesson
          includes Igbo key term support and a quiz at the end.
        </p>
      </div>

      {/* Stats bar */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 animate-fade-up'>
        {[
          { label: "Topics", value: "-", sub: "available" },
          { label: "Quizzes", value: "-", sub: "completed" },
          { label: "Avg Score", value: "-", sub: "across attempts" },
          { label: "Streak", value: "-", sub: "days active" },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className='glass-card rounded-xl p-4 border border-white/5 text-center'
          >
            <p className='font-display text-2xl text-ink-200'>{value}</p>
            <p className='text-xs font-semibold text-ink-400 font-body mt-0.5'>
              {label}
            </p>
            <p className='text-xs text-ink-600 font-body'>{sub}</p>
          </div>
        ))}
      </div>

      {/* Topic grid */}
      <div className='animate-fade-up'>
        <TopicGrid />
      </div>
    </div>
  );
}
