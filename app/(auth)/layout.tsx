// app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col relative overflow-hidden">
      {/* Ambient background orbs */}
      <div
        className="orb w-[500px] h-[500px] top-[-120px] left-[-100px]"
        style={{ background: "rgba(34,197,94,0.07)" }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[-80px] right-[-80px]"
        style={{ background: "rgba(217,115,25,0.06)" }}
      />
      <div
        className="orb w-[300px] h-[300px] top-[40%] right-[10%]"
        style={{ background: "rgba(34,197,94,0.04)" }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          {/* Leaf icon */}
          <div className="w-8 h-8 rounded-lg bg-forest-600/20 border border-forest-500/20
                          flex items-center justify-center group-hover:bg-forest-600/30
                          transition-colors duration-200">
            <svg
              className="w-4 h-4 text-forest-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 2-1 3-4 3-4S9.5 3 7.5 8c0 0 .5-3 3-4C10.5 4 4 5 4 11c0 2.5 1 4.5 2 6L8 16c3.15-3.37 9.17-3.5 9-8z" />
            </svg>
          </div>
          <span className="font-display text-lg text-ink-100 group-hover:text-forest-400
                           transition-colors duration-200">
            LearnSci
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 text-center">
        <p className="text-xs text-ink-600 font-body">
          Computer-Assisted Learning · Science with Igbo Support
        </p>
      </footer>
    </div>
  );
}
