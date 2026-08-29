"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    // İleride bir hata izleme servisi (Sentry vb.) eklemek istersen buraya eklenir.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-porcelain px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-black/5 bg-white text-center shadow-foilGlow">
        <div
          className="relative overflow-hidden px-6 pb-10 pt-8"
          style={{ background: "linear-gradient(135deg, #1E212B, #14161C)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[8.5rem] font-bold leading-none"
            style={{
              backgroundImage: "linear-gradient(135deg,#E8C9A0,#B8794A)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: 0.1,
            }}
          >
            !
          </div>

          <div className="relative">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border"
              style={{
                borderColor: "rgba(232,201,160,0.4)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E8C9A0"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-white">
              Beklenmeyen bir hata oluştu
            </p>
            <p className="mt-1 text-xs text-white/50">
              Sorun bizde olabilir. Tekrar denemek genelde yardımcı olur.
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-porcelain px-6 py-6">
          <button
            onClick={() => reset()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-foilStart to-foilEnd py-3 text-sm font-semibold text-carbon shadow-sm transition hover:brightness-105"
          >
            Tekrar Dene
          </button>
          <a
            href="/"
            className="block w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-ink transition hover:bg-black/5"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </main>
  );
}
