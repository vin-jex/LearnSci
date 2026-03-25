"use client";

import { useTranslation } from "@/lib/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleIgbo } from "@/lib/store/slices/igboSlice";

export function LandingLanguageToggle() {
  const dispatch = useAppDispatch();
  const isIgbo = useAppSelector((s) => s.igbo.isVisible);
  const { t } = useTranslation();

  return (
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
      <span className='flex items-center gap-px shrink-0'>
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
  );
}
