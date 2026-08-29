import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import EditUserForm from "./EditUserForm";
import { deleteUserAction } from "../../actions";
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
      </section>

      <EditUserForm user={user} />

      <form
        action={deleteUserAction}
        className="mt-4 rounded-xl2 border border-red-200 bg-red-50 p-4"
      >
        <input type="hidden" name="id" value={user.id} />
        <p className="mb-2 text-xs text-red-700">
          Bu hesabı ve kartvizitini kalıcı olarak siler.
        </p>
        <button className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
          Kullanıcıyı Sil
        </button>
      </form>
    </main>
  );
}
