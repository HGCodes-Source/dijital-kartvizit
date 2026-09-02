import { createClient } from "@supabase/supabase-js";

let client = null;

// Tek bir supabase client'i tekrar tekrar olusturmamak icin (server-only).
// SERVICE_ROLE anahtari sadece sunucuda kullanilir, tarayiciya asla gitmez
// (NEXT_PUBLIC_ on eki olmadigi icin Next.js bunu client bundle'a koymaz).
export function getSupabaseAdmin() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY tanimli degil. .env dosyanizi (ve Vercel'i) kontrol edin."
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}