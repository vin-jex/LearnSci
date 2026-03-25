"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/lib/store/hooks";
import { LandingLanguageToggle } from "@/components/landing/landing-language-toggle";

export default function HomePage() {
  const isIgbo = useAppSelector((s) => s.igbo.isVisible);

  const features = [
    { en: "📚 Structured Lessons", ig: "📚 Ihe Ọmụmụ Haziri" },
    { en: "🧪 Interactive Quizzes", ig: "🧪 Ọmụmụ Ajụjụ Na-arụ Ọrụ" },
    { en: "🌿 Igbo Key Terms", ig: "🌿 Okwu Isi Igbo" },
    { en: "📊 Adaptive Feedback", ig: "📊 Nzaaza N'ụzọ Nkà" },
    { en: "🏆 Progress Tracking", ig: "🏆 Nsochi Ọganiihu" },
  ];

  return (
    <div className='min-h-screen bg-ink-950 flex flex-col relative overflow-hidden'>
      <div
        className='orb w-[600px] h-[600px] top-[-150px] left-[-150px]'
        style={{ background: "rgba(34,197,94,0.08)" }}
      />
      <div
        className='orb w-[500px] h-[500px] bottom-[-100px] right-[-100px]'
        style={{ background: "rgba(217,115,25,0.07)" }}
      />

      <div
        className='absolute inset-0 opacity-[0.025]'
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <nav className='relative z-10 px-6 py-6 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-2 group'>
          <Image
            src='/favicon.svg'
            alt='LearnSci'
            className='w-8 h-8'
            width={32}
            height={32}
          />
          <span className='font-display text-base text-ink-100 group-hover:text-forest-400 transition-colors'>
            LearnSci
          </span>
        </Link>

        <div className='flex items-center gap-3'>
          <LandingLanguageToggle />

          <Link
            href='/login'
            className='text-sm text-ink-400 hover:text-ink-200 font-body transition-colors'
          >
            {isIgbo ? "Banye" : "Sign in"}
          </Link>

          <Link
            href='/register'
            className='hidden md:block text-sm bg-forest-600 hover:bg-forest-500 text-white font-body font-semibold px-4 py-2 rounded-lg transition-colors duration-200'
          >
            {isIgbo ? "Bido" : "Get started"}
          </Link>
        </div>
      </nav>

      <main className='relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-16 stagger'>
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-500/10 border border-forest-500/20 mb-8 animate-fade-up'>
          <div className='w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse' />
          <span className='text-xs font-semibold text-forest-400 tracking-wide'>
            {isIgbo
              ? "Sayensị · Nkwado Okwu Igbo"
              : "Science · Igbo Terminology Support"}
          </span>
        </div>

        <h1 className='font-display text-5xl md:text-7xl text-ink-100 leading-tight max-w-3xl mb-3 animate-fade-up'>
          {isIgbo ? (
            <>
              Mụta Sayensị. <span className='text-forest-400'>Ghọta</span> ya
              nke ọma.
            </>
          ) : (
            <>
              Learn Science. <span className='text-forest-400'>Understand</span>{" "}
              it deeply.
            </>
          )}
        </h1>

        <p className='text-base text-ink-500 font-body max-w-xl leading-relaxed mb-10 animate-fade-up'>
          {isIgbo
            ? "Ihe ọmụmụ na-arụ ọrụ, ọmụmụ ajụjụ nwere nzaaza ozugbo, na okwu Igbo - emere maka ụmụ akwụkwọ Naịjirịa."
            : "Interactive lessons, quizzes with instant feedback, and Igbo terminology - designed for Nigerian secondary school learners."}
        </p>

        <div className='flex flex-col sm:flex-row gap-3 animate-fade-up'>
          <Link
            href='/register'
            className='px-8 py-3.5 bg-forest-600 hover:bg-forest-500 text-white font-body font-semibold rounded-xl transition-colors duration-200 text-sm'
          >
            {isIgbo ? "Bido Ọmụmụ - Ọ Bụ n'Efu" : "Start Learning - It's Free"}
          </Link>

          <Link
            href='/login'
            className='px-8 py-3.5 glass-card hover:bg-white/5 text-ink-300 font-body font-semibold rounded-xl transition-colors duration-200 text-sm'
          >
            {isIgbo ? "Banye" : "Sign In"}
          </Link>
        </div>

        <div className='mt-16 flex flex-wrap gap-3 justify-center animate-fade-up'>
          {features.map((f) => (
            <span
              key={f.en}
              className='px-4 py-2 rounded-full glass-card text-xs font-body text-ink-400 border border-white/5'
            >
              {isIgbo ? f.ig : f.en}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
