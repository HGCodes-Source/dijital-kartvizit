"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateUserAction } from "../../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-60"
    >
      {pending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
    </button>
  );
}

export default function EditUserForm({ user }) {
  const [state, formAction] = useActionState(updateUserAction, { error: null });

  return (
    <form
      action={formAction}
      className="mt-4 space-y-4 rounded-xl2 border border-black/5 bg-white p-6"
    >
      <input type="hidden" name="id" value={user.id} />

      <div>
        <label className="mb-1 block text-xs font-medium text-slate">
          Giriş E-postası
        </label>
        <input
          name="email"
          type="email"
          defaultValue={user.email}
          className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate">
          Kartvizit URL Adresi
        </label>
        <div className="flex items-center rounded-lg border border-black/10 focus-within:border-ink">
          <span className="pl-3 text-xs text-slate">/kart/</span>
          <input
            name="slug"
            defaultValue={user.slug}
            className="w-full rounded-lg px-2 py-2.5 text-sm outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate">
          Yeni Şifre
        </label>
        <input
          name="password"
          placeholder="Değiştirmek istemiyorsanız boş bırakın"
          className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
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
