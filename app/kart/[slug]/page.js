import { notFound } from "next/navigation";
import { getUserBySlug } from "@/lib/db";
import CardPreview from "@/components/CardPreview";

export default async function PublicCardPage({ params }) {
  const user = await getUserBySlug(params.slug);
  if (!user || user.active === false) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const publicUrl = `${baseUrl}/kart/${params.slug}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-porcelain px-4 py-10">
      <div className="w-full">
        <CardPreview
          card={user.card}
          qrValue={publicUrl}
          vcardHref={`/kart/${params.slug}/vcard`}
          slug={params.slug}
        />
        <p className="mt-6 text-center text-[11px] text-slate">
          Dijital Kartvizit ile hazırlandı
        </p>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const user = await getUserBySlug(params.slug);
  if (!user) return {};
  return {
    title: `${user.card?.name || "Kartvizit"} — Dijital Kartvizit`,
    description: user.card?.title || "",
  };
}
