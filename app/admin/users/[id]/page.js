import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import EditUserForm from "./EditUserForm";
import { deleteUserAction } from "../../actions";

export default function EditUserPage({ params }) {
  requireAdmin();
  const user = getUserById(params.id);
  if (!user || user.role !== "user") notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Link href="/admin" className="text-xs text-slate hover:underline">
        ← Panele dön
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hesabı Düzenle</h1>
        <Link
          href={`/kart/${user.slug}`}
          target="_blank"
          className="text-xs text-blue-600 hover:underline"
        >
          Kartviziti görüntüle →
        </Link>
      </div>

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
