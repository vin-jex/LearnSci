"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleIgbo } from "@/lib/store/slices/igboSlice";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function IgboToggle() {
  const dispatch = useAppDispatch();
  const isVisible = useAppSelector((s) => s.igbo.isVisible);
  const { t } = useTranslation();

  return (
    <button
      onClick={() => dispatch(toggleIgbo())}
      className={`
        inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold
        font-body transition-all duration-200 border
        ${
          isVisible
            ? "bg-earth-400/15 border-earth-400/30 text-earth-300 hover:bg-earth-400/20"
            : "bg-ink-900/60 border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-300"
        }
      `}
      title={isVisible ? "Hide Igbo" : "Show Igbo"}
    >
      <span className='flex items-center gap-0.5'>
        <span className='w-2 h-3 rounded-sm bg-forest-600 opacity-80' />
        <span className='w-2 h-3 rounded-sm bg-white opacity-30' />
        <span className='w-2 h-3 rounded-sm bg-forest-600 opacity-80' />
      </span>
      {isVisible ? t("lesson.igboOn") : t("lesson.igboOff")}

      <span
        className={`
          relative inline-flex w-7 h-4 rounded-full transition-colors duration-200
          ${isVisible ? "bg-earth-500" : "bg-ink-700"}
        `}
      >
        <span
          className={`
            absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200
            ${isVisible ? "translate-x-3.5" : "translate-x-0.5"}
          `}
        />
      </span>
    </button>
  );
}
