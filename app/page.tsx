import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className='min-h-screen bg-ink-950 flex flex-col relative overflow-hidden'>
      {/* Background orbs */}
      <div
        className='orb w-[600px] h-[600px] top-[-150px] left-[-150px]'
        style={{ background: "rgba(34,197,94,0.08)" }}
      />
      <div
        className='orb w-[500px] h-[500px] bottom-[-100px] right-[-100px]'
        style={{ background: "rgba(217,115,25,0.07)" }}
      />

      {/* Grid texture */}
      <div
        className='absolute inset-0 opacity-[0.025]'
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Nav */}
      <nav className='relative z-10 px-6 py-6 flex items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          <div
            className='w-8 h-8 rounded-lg bg-forest-600/20 border border-forest-500/20
                          flex items-center justify-center'
          >
            <svg
              className='w-4 h-4 text-forest-400'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 2-1 3-4 3-4S9.5 3 7.5 8c0 0 .5-3 3-4C10.5 4 4 5 4 11c0 2.5 1 4.5 2 6L8 16c3.15-3.37 9.17-3.5 9-8z' />
            </svg>
          </div>
          <span className='font-display text-lg text-ink-100'>LearnSci</span>
        </div>
        <div className='flex items-center gap-3'>
          <Link
            href='/login'
            className='text-sm text-ink-400 hover:text-ink-200 font-body transition-colors'
          >
            Sign in
          </Link>
          <Link
            href='/register'
            className='text-sm bg-forest-600 hover:bg-forest-500 text-white font-body
                       font-semibold px-4 py-2 rounded-lg transition-colors duration-200'
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main
        className='relative z-10 flex-1 flex flex-col items-center justify-center
                       text-center px-4 py-16 stagger'
      >
        {/* Badge */}
        <div
          className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-forest-500/10 border border-forest-500/20 mb-8 animate-fade-up'
        >
          <div className='w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse' />
          <span className='text-xs font-semibold text-forest-400 tracking-wide'>
            Science · Igbo Terminology Support
          </span>
        </div>

        {/* Headline */}
        <h1
          className='font-display text-5xl md:text-7xl text-ink-100 leading-tight
                       max-w-3xl mb-6 animate-fade-up'
        >
          Learn Science. <span className='text-forest-400'>Understand</span> it
          deeply.
        </h1>

        <p
          className='text-lg text-ink-400 font-body max-w-xl leading-relaxed
                      mb-10 animate-fade-up'
        >
          Interactive lessons, quizzes with instant feedback, and Igbo
          terminology - designed for Nigerian secondary school learners.
        </p>

        {/* CTAs */}
        <div className='flex flex-col sm:flex-row gap-3 animate-fade-up'>
          <Link
            href='/register'
            className='px-8 py-3.5 bg-forest-600 hover:bg-forest-500 text-white
                       font-body font-semibold rounded-xl transition-colors duration-200
                       text-sm'
          >
            Start Learning - It&apos;s Free
          </Link>
          <Link
            href='/login'
            className='px-8 py-3.5 glass-card hover:bg-white/5 text-ink-300
                       font-body font-semibold rounded-xl transition-colors duration-200
                       text-sm'
          >
            Sign In
          </Link>
        </div>

        {/* Feature pills */}
        <div className='mt-16 flex flex-wrap gap-3 justify-center animate-fade-up'>
          {[
            "📚 Structured Lessons",
            "🧪 Interactive Quizzes",
            "🌿 Igbo Key Terms",
            "📊 Adaptive Feedback",
            "🏆 Progress Tracking",
          ].map((f) => (
            <span
              key={f}
              className='px-4 py-2 rounded-full glass-card text-xs font-body
                         text-ink-400 border border-white/5'
            >
              {f}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
