"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { label: "Topics", href: "/admin/topics" },
  { label: "Dashboard", href: "/dashboard" },
];

export function AdminNav({ userName }: { userName: string }) {
  const path = usePathname();

  return (
    <nav className='sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-xl'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          {/* Logo */}
          <Link href='/admin/topics' className='flex items-center gap-2 group'>
            <div
              className='w-7 h-7 rounded-lg bg-earth-400/20 border border-earth-400/30
                            flex items-center justify-center'
            >
              <svg
                className='w-3.5 h-3.5 text-earth-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
              </svg>
            </div>
            <span className='font-display text-base text-ink-100'>Admin</span>
          </Link>

          {/* Nav links */}
          <div className='hidden sm:flex items-center gap-1'>
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-colors ${
                  path.startsWith(href) && href !== "/dashboard"
                    ? "bg-earth-400/15 text-earth-300"
                    : "text-ink-500 hover:text-ink-300"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <span className='hidden sm:block text-xs text-ink-500 font-body'>
            {userName}
          </span>
          <span
            className='text-xs font-semibold text-earth-500 bg-earth-400/10
                           border border-earth-400/20 px-2 py-0.5 rounded-full font-body'
          >
            Admin
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className='text-xs text-ink-600 hover:text-red-400 font-body transition-colors'
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
