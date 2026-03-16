"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function DashboardNav({ user }: Props) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const isAdmin = user.role === "ADMIN";

  return (
    <nav className='sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-4'>
          <Link href='/dashboard' className='flex items-center gap-2 group'>
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

          {/* Admin link */}
          {isAdmin && (
            <Link
              href='/admin/topics'
              className='hidden sm:flex items-center gap-1.5 text-xs font-semibold font-body text-earth-400 hover:text-earth-300 border border-earth-400/20 bg-earth-400/8 hover:bg-earth-400/15 px-2.5 py-1 rounded-lg transition-colors'
            >
              <svg className='w-3 h-3' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
                  clipRule='evenodd'
                />
              </svg>
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className='flex items-center gap-3'>
          <div
            className='w-8 h-8 rounded-full bg-forest-600/20 border border-forest-500/30
                          flex items-center justify-center'
          >
            <span className='text-xs font-bold text-forest-400 font-body'>
              {initials}
            </span>
          </div>
          <span className='hidden sm:block text-sm text-ink-400 font-body'>
            {user.name}
          </span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className='text-xs text-ink-500 hover:text-red-400 transition-colors font-body disabled:opacity-50 flex items-center gap-1.5'
          >
            {signingOut ? (
              <div className='spinner !w-3 !h-3' />
            ) : (
              <svg
                className='w-3.5 h-3.5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                  clipRule='evenodd'
                />
              </svg>
            )}
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
