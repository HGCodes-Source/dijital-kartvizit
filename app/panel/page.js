import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/lib/logout";
import PanelEditor from "./PanelEditor";

export default async function PanelPage() {
  const user = await requireUser();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brass">
            Kartvizitim
          </p>
          <h1 className="font-display text-xl font-semibold">Kartvizitini Düzenle</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate">{user.email}</span>
          <form action={logoutAction}>
            <button className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5">
              Çıkış Yap
            </button>
          </form>
        </div>
      </header>

      <PanelEditor
        initialCard={user.card}
        slug={user.slug}
        baseUrl={baseUrl}
      />
    </main>
  );
}
