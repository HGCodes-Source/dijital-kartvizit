import { notFound } from "next/navigation";
import { getUserBySlug } from "@/lib/db";
import CardPreview from "@/components/CardPreview";

function InactiveCardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-porcelain px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-black/5 bg-white text-center shadow-foilGlow">
        <div
          className="relative overflow-hidden px-6 pb-10 pt-8"
          style={{ background: "linear-gradient(135deg, #1E212B, #14161C)" }}
        >
          <div className="relative">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border"
              style={{
                borderColor: "rgba(232,201,160,0.4)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E8C9A0"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-white">
              Bu kartvizit şu anda aktif değil
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/50">
              Üyelik süresi sona ermiş olabilir. Kartın sahibiyseniz,
              yenilemek için yöneticinizle iletişime geçin.
            </p>
          </div>
        </div>
        <div className="bg-porcelain px-6 py-6">
          <a
            href="/"
            className="block w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-ink transition hover:bg-black/5"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </main>
  );
}

export default async function PublicCardPage({ params }) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);
  if (!user) notFound();
  if (user.active === false) return <InactiveCardPage />;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const publicUrl = `${baseUrl}/kart/${slug}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-porcelain px-4 py-10">
      <div className="w-full">
        <CardPreview
          card={user.card}
          qrValue={publicUrl}
          vcardHref={`/kart/${slug}/vcard`}
          slug={slug}
        />
        <p className="mt-6 text-center text-[11px] text-slate">
          Dijital Kartvizit ile hazırlandı
        </p>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);
  if (!user) return {};
  return {
    title: `${user.card?.name || "Kartvizit"} — Dijital Kartvizit`,
    description: user.card?.title || "",
  };
}
