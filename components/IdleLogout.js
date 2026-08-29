"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearSessionAction } from "@/lib/logout";

// Bu süre kadar (ms) hiçbir işlem yapılmazsa oturum otomatik kapatılır.
// Değiştirmek istersen sadece bu satırı güncellemen yeterli.
const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 dakika

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

export default function IdleLogout() {
  const router = useRouter();
  const timerRef = useRef(null);

  useEffect(() => {
    function handleIdle() {
      // Kullanıcıyı hemen yönlendir, oturum çerezini arka planda temizle.
      router.push("/login?timeout=1");
      clearSessionAction().catch(() => {});
    }

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleIdle, IDLE_TIMEOUT_MS);
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, resetTimer, { passive: true })
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, resetTimer)
      );
    };
  }, [router]);

  return null;
}
