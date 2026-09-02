// ============================================================
// BU DOSYAYI DİJİTAL KARTVİZİT PROJESİNE ekleyin:
// app/api/entegrasyon/uyelik-olustur/route.js
//
// DÜZELTME: Artık kendi supabase client'ımızı oluşturmuyoruz — projenizde
// zaten hazır olan lib/supabaseClient.js dosyasındaki getSupabaseAdmin()
// fonksiyonunu kullanıyoruz. Önceki sürümde yanlış env değişkeni ismi
// (NEXT_PUBLIC_SUPABASE_URL) aramıştım, bu yüzden "supabaseUrl is
// required" hatası alıyordunuz — artık düzeldi.
// ============================================================
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseClient";
import crypto from "crypto";

// lib/auth.js'deki hashPassword ile BİREBİR AYNI mantık. İsterseniz
// burada tekrar yazmak yerine oradan import edip kullanabilirsiniz:
// import { hashPassword } from "@/lib/auth";
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

// Yeni müşteri için okunabilir, rastgele bir şifre üretir
function rastgeleSifreUret() {
  return crypto.randomBytes(8).toString("base64url").slice(0, 10);
}

function slugUret(isim) {
  const temel = isim
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return temel || "kullanici";
}

export async function POST(istek) {
  // 1) Güvenlik: sadece doğru anahtarı bilen (yani satış sitesi) istek atabilsin
  const gelenAnahtar = istek.headers.get("X-Entegrasyon-Anahtari");
  const dogruAnahtar = process.env.SATIS_SITESI_ENTEGRASYON_ANAHTARI;

  if (!dogruAnahtar || gelenAnahtar !== dogruAnahtar) {
    return NextResponse.json({ hata: "Yetkisiz istek." }, { status: 401 });
  }

  // 2) Gelen veriyi oku
  const { email, ad, bitisTarihi, plan } = await istek.json();
  if (!email || !bitisTarihi) {
    return NextResponse.json({ hata: "email ve bitisTarihi zorunlu." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // 3) Bu e-posta zaten var mı diye bak
  const { data: mevcutKullanici } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (mevcutKullanici) {
    // MEVCUT MÜŞTERİ (yenileme): sadece paket/bitiş tarihini güncelle,
    // şifreye DOKUNMA — zaten bir şifresi var.
    const { error } = await supabase
      .from("users")
      .update({
        plan,
        expires_at: bitisTarihi,
        active: true,
      })
      .eq("email", email);

    if (error) {
      console.error("Supabase güncelleme hatası:", error);
      return NextResponse.json({ hata: "Güncelleme başarısız." }, { status: 500 });
    }

    return NextResponse.json({ basari: true, yeniMi: false });
  }

  // 4) YENİ MÜŞTERİ: hesap ve rastgele bir şifre oluştur
  const isim = ad || email.split("@")[0];
  const gecicSifre = rastgeleSifreUret();

  const { error } = await supabase.from("users").insert({
    id: `user-${Date.now()}`,
    role: "user",
    email,
    password_hash: hashPassword(gecicSifre),
    slug: slugUret(isim),
    active: true,
    card: { bio: "", name: isim, links: [] },
    plan,
    expires_at: bitisTarihi,
  });

  if (error) {
    console.error("Supabase ekleme hatası:", error);
    return NextResponse.json({ hata: "Kayıt oluşturulamadı." }, { status: 500 });
  }

  // Düz metin şifreyi SADECE bu ilk yanıtta döndürüyoruz (veritabanında
  // hiçbir yerde düz metin olarak saklanmıyor) — satış sitesi admin
  // panelinde bunu görüp müşteriye WhatsApp'tan iletebilecek.
  return NextResponse.json({ basari: true, yeniMi: true, gecicSifre });
}
