"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleIgbo } from "@/lib/store/slices/igboSlice";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface Props {
  user: { name?: string | null; email?: string | null; role?: string };
}

export function DashboardNav({ user }: Props) {
  const [signingOut, setSigningOut] = useState(false);
  const dispatch = useAppDispatch();
  const isIgbo = useAppSelector((s) => s.igbo.isVisible);
  const { t } = useTranslation();

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
      <div className='max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3 min-w-0'>
          <Link
            href='/dashboard'
            className='flex items-center gap-2 group shrink-0'
          >
            <div className='w-6 h-6 rounded-md bg-forest-600/20 border border-forest-500/20 flex items-center justify-center group-hover:bg-forest-600/30 transition-colors'>
              <svg
                className='w-3 h-3 text-forest-400'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2 2-1 3-4 3-4S9.5 3 7.5 8c0 0 .5-3 3-4C10.5 4 4 5 4 11c0 2.5 1 4.5 2 6L8 16c3.15-3.37 9.17-3.5 9-8z' />
              </svg>
            </div>
            <span className='font-display text-sm text-ink-100 hidden sm:block'>
              LearnSci
            </span>
          </Link>

          {isAdmin && (
            <Link
              href='/admin/topics'
              className='hidden sm:flex items-center gap-1 text-xs font-semibold font-body text-earth-400 hover:text-earth-300 border border-earth-400/20 bg-earth-400/8 hover:bg-earth-400/15 px-2 py-0.5 rounded-md transition-colors'
            >
              <svg className='w-3 h-3' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
                  clipRule='evenodd'
                />
              </svg>
              {t("nav.admin")}
            </Link>
          )}
        </div>

        <div className='flex items-center gap-2 shrink-0'>
          <button
            onClick={() => dispatch(toggleIgbo())}
            title={isIgbo ? "Hide Igbo" : "Show Igbo"}
            className={`
              inline-flex items-center gap-1.5 rounded-lg border transition-all duration-200
              px-2 py-1 sm:px-2.5 sm:py-1.5
              ${
                isIgbo
                  ? "bg-earth-400/15 border-earth-400/30 text-earth-300 hover:bg-earth-400/20"
                  : "bg-ink-900/60 border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-300"
              }
            `}
          >
            <span className='sm:flex items-center gap-px shrink-0 hidden'>
              <span className='w-1.5 h-2.5 rounded-sm bg-forest-600 opacity-80' />
              <span className='w-1.5 h-2.5 rounded-sm bg-white opacity-30' />
              <span className='w-1.5 h-2.5 rounded-sm bg-forest-600 opacity-80' />
            </span>

            <span className='block text-xs font-semibold font-body'>
              {isIgbo ? t("lesson.igboOn") : t("lesson.igboOff")}
            </span>

            <span
              className={`
              relative inline-flex w-6 h-3.5 rounded-full transition-colors duration-200 shrink-0
              ${isIgbo ? "bg-earth-500" : "bg-ink-700"}
            `}
            >
              <span
                className={`
                absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow transition-transform duration-200
                ${isIgbo ? "translate-x-3" : "translate-x-0.5"}
              `}
              />
            </span>
          </button>

          <div className='w-7 h-7 rounded-full bg-forest-600/20 border border-forest-500/30 flex items-center justify-center shrink-0'>
            <span className='text-xs font-bold text-forest-400 font-body leading-none'>
              {initials}
            </span>
          </div>

          <span className='hidden md:block text-sm text-ink-400 font-body truncate max-w-[120px]'>
            {user.name}
          </span>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            title={t("nav.signOut")}
            className='text-xs text-ink-500 hover:text-red-400 transition-colors font-body disabled:opacity-50 flex items-center gap-1'
          >
            {signingOut ? (
              <div className='spinner !w-3 !h-3' />
            ) : (
              <>
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
                <span className='hidden sm:block'>{t("nav.signOut")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
