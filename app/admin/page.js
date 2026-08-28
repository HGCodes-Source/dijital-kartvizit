import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getUsers } from "@/lib/db";
import { toggleActiveAction } from "./actions";
import { logoutAction } from "@/lib/logout";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const allUsers = await getUsers();
  const users = allUsers.filter((u) => u.role === "user");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brass">
            Yönetici Paneli
          </p>
          <h1 className="font-display text-xl font-semibold">Müşteri Kartvizitleri</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate">{admin.email}</span>
          <form action={logoutAction}>
            <button className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5">
              Çıkış Yap
            </button>
          </form>
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate">
          Toplam {users.length} müşteri kartviziti
        </p>
        <Link
          href="/admin/users/new"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
        >
          + Yeni Kullanıcı Ekle
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl2 border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/[0.03] text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-4 py-3">İsim</th>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">Kartvizit Linki</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate">
                  Henüz kullanıcı eklenmemiş. "Yeni Kullanıcı Ekle" ile başlayın.
                </td>
              </tr>
            )}
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
    </main>
  );
}
