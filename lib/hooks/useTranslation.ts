"use client";
import { useAppSelector } from "@/lib/store/hooks";
import en from "@/messages/en.json";
import ig from "@/messages/ig.json";

type Messages = typeof en;

export function useTranslation() {
  const isIgbo = useAppSelector((s) => s.igbo.isVisible);
  const messages: Messages = isIgbo ? (ig as Messages) : en;

  function t(key: keyof Messages): string {
    return messages[key] ?? key;
  }

  return { t, isIgbo };
}
