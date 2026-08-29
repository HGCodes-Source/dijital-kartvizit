import { deactivateExpiredUsers } from "@/lib/db";

// Vercel Cron gunde bir kere bu adresi cagirir (bkz. vercel.json).
// CRON_SECRET ortam degiskeni tanimliysa Vercel bu istegi otomatik olarak
// "Authorization: Bearer <CRON_SECRET>" basligiyla gonderir; biz de burada
// dogruluyoruz ki disaridan rastgele biri bu adresi tetikleyemesin.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const deactivated = await deactivateExpiredUsers();
  return Response.json({
    ok: true,
    deactivatedCount: deactivated.length,
    deactivatedIds: deactivated.map((u) => u.id),
  });
}
