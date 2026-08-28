import { getUserBySlug } from "@/lib/db";
import { buildVCard } from "@/lib/vcard";

export async function GET(request, { params }) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);
  if (!user) {
    return new Response("Bulunamadı", { status: 404 });
  }

  const vcard = buildVCard(user.card);
  const filename = `${(user.card?.name || "kartvizit").replace(/\s+/g, "_")}.vcf`;

  return new Response(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
