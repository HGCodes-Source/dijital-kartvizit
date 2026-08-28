"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createUserAction } from "../../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-60"
    >
      {pending ? "Oluşturuluyor..." : "Kullanıcıyı Oluştur"}
    </button>
  );
}

export default function NewUserPage() {
  const [state, formAction] = useActionState(createUserAction, { error: null });

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Link href="/admin" className="text-xs text-slate hover:underline">
        ← Panele dön
      </Link>
      <h1 className="mb-6 mt-2 text-xl font-semibold">Yeni Kullanıcı Ekle</h1>

      <form
        action={formAction}
        className="space-y-4 rounded-xl2 border border-black/5 bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate">
            Ad Soyad
          </label>
          <input
            name="name"
            required
            placeholder="Elif Yılmaz"
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate">
            Ünvan / Meslek
          </label>
          <input
            name="title"
            placeholder="Dijital Pazarlama Uzmanı"
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
              placeholder="elif-yilmaz (boş bırakılırsa isimden oluşturulur)"
              className="w-full rounded-lg px-2 py-2.5 text-sm outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate">
            Giriş E-postası
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="musteri@eposta.com"
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate">
            Geçici Şifre
          </label>
          <input
            name="password"
            required
            placeholder="Müşteriye ileteceğiniz şifre"
            className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {state.error}
          </p>
        )}

        <SubmitButton />
        <p className="text-[11px] text-slate">
          Kullanıcı, bu bilgilerle giriş yaptıktan sonra kendi kartvizitindeki
          isim, ünvan ve sosyal medya/bağlantılarını kendi panelinden
          düzenleyebilir.
        </p>
      </form>
    </main>
  );
}
