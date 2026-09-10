import { requireUser } from "@/lib/auth";
import { logoutAction } from "@/lib/logout";
import PanelEditor from "./PanelEditor";
import { PLAN_LABELS, daysRemaining, formatExpiryDate } from "@/lib/subscription";

function SubscriptionBanner({ user }) {
  const remaining = daysRemaining(user);

  if (user.plan === "trial") {
    const urgent = remaining !== null && remaining <= 3;
    return (
      <div
        className={`mb-6 rounded-xl border px-4 py-3 text-xs ${
          urgent
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}
      >
        <span className="font-semibold">
          {remaining !== null && remaining >= 0
            ? `Deneme sürene ${remaining} gün kaldı.`
            : "Deneme süren sona erdi."}
        </span>{" "}
        Üyeliğini devam ettirmek için yöneticinle iletişime geç.
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
      <span className="font-semibold">{PLAN_LABELS[user.plan] || "Üyelik"}</span>{" "}
      · bitiş tarihi: {formatExpiryDate(user.expiresAt)}
    </div>
  );
}

export default async function PanelPage() {
  const user = await requireUser();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brass">
            Kartvizitim
          </p>
          <h1 className="font-display text-lg font-semibold sm:text-xl">
            Kartvizitini Düzenle
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="truncate text-xs text-slate">{user.email}</span>
          <form action={logoutAction}>
            <button className="shrink-0 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5">
              Çıkış Yap
            </button>
          </form>
        </div>
      </header>

      <SubscriptionBanner user={user} />

      <PanelEditor
        initialCard={user.card}
        slug={user.slug}
        baseUrl={baseUrl}
        viewCount={user.viewCount || 0}
      />
    </main>
  );
}
