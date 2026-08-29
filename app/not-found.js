import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-porcelain px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-black/5 bg-white text-center shadow-foilGlow">
        <div
          className="relative overflow-hidden px-6 pb-10 pt-8"
          style={{ background: "linear-gradient(135deg, #1E212B, #14161C)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[9rem] font-bold leading-none"
            style={{
              backgroundImage: "linear-gradient(135deg,#E8C9A0,#B8794A)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: 0.1,
            }}
          >
            404
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
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
                <path d="M8 11h6" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-white">
              Bu kartvizit bulunamadı
            </p>
            <p className="mt-1 text-xs text-white/50">
              Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış
              olabilir.
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-porcelain px-6 py-6">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-foilStart to-foilEnd py-3 text-sm font-semibold text-carbon shadow-sm transition hover:brightness-105"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/login"
            className="block w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-ink transition hover:bg-black/5"
          >
            Giriş Sayfasına Git
          </Link>
        </div>
      </div>
    </main>
  );
}
