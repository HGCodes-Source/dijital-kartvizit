import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getUsers } from "@/lib/db";
import { toggleActiveAction } from "./actions";
import { logoutAction } from "@/lib/logout";
import SubscriptionBadge from "@/components/SubscriptionBadge";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const allUsers = await getUsers();
  const users = allUsers.filter((u) => u.role === "user");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brass">
            Yönetici Paneli
          </p>
          <h1 className="font-display text-lg font-semibold sm:text-xl">
            Müşteri Kartvizitleri
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="truncate text-xs text-slate">{admin.email}</span>
          <form action={logoutAction}>
            <button className="shrink-0 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5">
              Çıkış Yap
            </button>
          </form>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">
          Toplam {users.length} müşteri kartviziti
        </p>
        <Link
          href="/admin/users/new"
          className="rounded-lg bg-ink px-4 py-2 text-center text-sm font-semibold text-white hover:bg-ink/90"
        >
          + Yeni Kullanıcı Ekle
        </Link>
      </div>

      {users.length === 0 && (
        <div className="rounded-xl2 border border-black/5 bg-white px-4 py-10 text-center text-sm text-slate">
          Henüz kullanıcı eklenmemiş. "Yeni Kullanıcı Ekle" ile başlayın.
        </div>
      )}

      {/* Mobil: kart listesi */}
      {users.length > 0 && (
        <div className="space-y-3 md:hidden">
          {users.map((u) => (
            <div
              key={u.id}
              className="rounded-xl2 border border-black/5 bg-white p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {u.card?.name || "—"}
                  </p>
                  <p className="truncate text-xs text-slate">
                    {u.card?.title}
                  </p>
                </div>
                <form action={toggleActiveAction} className="shrink-0">
                  <input type="hidden" name="id" value={u.id} />
                  <button
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      u.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.active ? "Aktif" : "Devre Dışı"}
                  </button>
                </form>
              </div>
              <p className="truncate text-xs text-slate">{u.email}</p>
              <Link
                href={`/kart/${u.slug}`}
                target="_blank"
                className="mt-1 block truncate text-xs text-blue-600 hover:underline"
              >
                {baseUrl.replace(/^https?:\/\//, "")}/kart/{u.slug}
              </Link>
              <Link
                href={`/${u.slug}/login`}
                target="_blank"
                className="mt-0.5 block truncate text-xs text-slate hover:underline"
              >
                Giriş: {baseUrl.replace(/^https?:\/\//, "")}/{u.slug}/login
              </Link>
              <div className="mt-3 border-t border-black/5 pt-3">
                <SubscriptionBadge user={u} compact />
              </div>
              <Link
                href={`/admin/users/${u.id}`}
                className="mt-3 block rounded-lg border border-black/10 px-3 py-1.5 text-center text-xs font-medium hover:bg-black/5"
              >
                Düzenle
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Masaüstü: tablo */}
      {users.length > 0 && (
        <div className="hidden overflow-x-auto rounded-xl2 border border-black/5 bg-white md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">İsim</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Kartvizit Linki</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Üyelik</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium">
                    {u.card?.name || "—"}
                    <div className="text-xs font-normal text-slate">
                      {u.card?.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">{u.email}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/kart/${u.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {baseUrl.replace(/^https?:\/\//, "")}/kart/{u.slug}
                    </Link>
                    <div className="mt-0.5 text-xs text-slate">
                      Giriş:{" "}
                      <Link
                        href={`/${u.slug}/login`}
                        target="_blank"
                        className="hover:underline"
                      >
                        /{u.slug}/login
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleActiveAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <button
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.active ? "Aktif" : "Devre Dışı"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <SubscriptionBadge user={u} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
