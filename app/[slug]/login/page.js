import { notFound } from "next/navigation";
import { getUserBySlug } from "@/lib/db";
import SlugLoginForm from "./SlugLoginForm";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default async function SlugLoginPage({ params }) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);
  if (!user || user.role !== "user") notFound();

  const card = user.card || {};
  const theme = card.theme || "#0F1B33";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl2 border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          {card.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.avatarUrl}
              alt={card.name}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: theme }}
            >
              {initials(card.name) || "?"}
            </div>
          )}
          <div>
            <p className="font-display text-sm font-semibold leading-none">
              {card.name || "Kartvizit"}
            </p>
            <p className="mt-1 text-xs leading-none text-slate">
              Kartvizit Girişi
            </p>
          </div>
        </div>

        <SlugLoginForm slug={slug} />

        <p className="mt-6 text-center text-[11px] text-slate">
          Bu, sadece size özel giriş sayfanızdır. Sorun yaşarsanız
          yöneticinizle iletişime geçin.
        </p>
      </div>
    </main>
  );
}
