import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import EditUserForm from "./EditUserForm";
import DeleteUserForm from "./DeleteUserForm";
import SubscriptionBadge from "@/components/SubscriptionBadge";

export default async function EditUserPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const user = await getUserById(id);
  if (!user || user.role !== "user") notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-6 sm:py-10">
      <Link href="/admin" className="text-xs text-slate hover:underline">
        ← Panele dön
      </Link>
      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold sm:text-xl">Hesabı Düzenle</h1>
        <Link
          href={`/kart/${user.slug}`}
          target="_blank"
          className="text-xs text-blue-600 hover:underline"
        >
          Kartviziti görüntüle →
        </Link>
      </div>
      <p className="mt-1 text-xs text-slate">
        Müşteriye özel giriş linki:{" "}
        <Link
          href={`/${user.slug}/login`}
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          /{user.slug}/login
        </Link>
      </p>

      <section className="mt-4 rounded-xl2 border border-black/5 bg-white p-4 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold">Üyelik Durumu</h2>
        <SubscriptionBadge user={user} compact />
        <p className="mt-3 text-xs text-slate">
          👁 Kartvizit {user.viewCount || 0} kere görüntülendi
        </p>
      </section>

      <EditUserForm user={user} />

      <DeleteUserForm userId={user.id} userName={user.card?.name} />
    </main>
  );
}
