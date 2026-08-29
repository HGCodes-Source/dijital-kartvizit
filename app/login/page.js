"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-60"
    >
      {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
    </button>
  );
}

function TimeoutBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get("timeout") !== "1") return null;
  return (
    <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
      Uzun süre işlem yapılmadığı için oturumunuz güvenlik amacıyla
      sonlandırıldı. Tekrar giriş yapabilirsiniz.
    </p>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { error: null });

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl2 border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-foilStart to-foilEnd text-sm font-bold text-carbon">
            DK
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-none">Dijital Kartvizit</p>
            <p className="text-xs leading-none text-slate mt-1">Yönetim Paneli</p>
          </div>
        </div>

        <Suspense fallback={null}>
          <TimeoutBanner />
        </Suspense>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">
              E-posta
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="ornek@eposta.com"
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate">
              Şifre
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink focus:ring-1 focus:ring-ink"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-[11px] text-slate">
          Hesabınız yok mu? Bu panel davetle çalışır — yöneticinizden hesap
          talep edin.
        </p>
      </div>
    </main>
  );
}
