// ============================================================
// app/api/entegrasyon/uyelik-olustur/route.js
//
// Ne işe yarar: Satış sitesi (HSG Dijital) bir sipariş onaylandığında
// buraya bir istek atar; bu kod da Supabase veritabanınızda müşteriyi
// bulur (yoksa oluşturur) ve üyelik bitiş tarihini günceller.
// ============================================================
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseClient";
import crypto from "crypto";

// lib/auth.js'deki hashPassword ile BİREBİR AYNI mantık (Node'un
// yerleşik crypto.scrypt'i, "salt:hash" formatı) — böylece burada
// oluşan hesaplar normal giriş ekranınızdan sorunsuz giriş yapabilir.
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return '${salt}:${derived}';
}

// Yeni müşteri için okunabilir, rastgele bir şifre üretir (ör. "k3f9m2xa1q")
function rastgeleSifreUret() {
  return crypto.randomBytes(8).toString("base64url").slice(0, 10);
}

// "Elif Yılmaz" → "elif-yilmaz" gibi basit bir slug üretici
// (herkese açık kartvizit linki için kullanılıyor)
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

  // Projenizde zaten hazır olan supabase istemcisini kullanıyoruz
  // (lib/supabaseClient.js) — kendi client'ımızı oluşturmuyoruz.
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
    id: `user-${Date.now()}',
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