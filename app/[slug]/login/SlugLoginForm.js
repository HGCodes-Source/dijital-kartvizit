"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginActionForSlug } from "./actions";

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

export default function SlugLoginForm({ slug }) {
  const boundAction = loginActionForSlug.bind(null, slug);
  const [state, formAction] = useActionState(boundAction, { error: null });

  return (
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
  );
}
