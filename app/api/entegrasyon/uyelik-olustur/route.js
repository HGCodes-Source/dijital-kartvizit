// ============================================================
// BU DOSYAYI DİJİTAL KARTVİZİT PROJESİNE ekleyin:
// app/api/entegrasyon/uyelik-olustur/route.js
//
// lib/auth.js'deki AYNI şifreleme yöntemini (Node crypto.scrypt,
// "salt:hash" formatı) burada da kullanıyoruz ki bu şekilde oluşan
// hesaplar normal giriş ekranınızdan sorunsuz giriş yapabilsin.
//
// Kalan tek soru: "plan" sütununda aylık paket için hangi kelime
// kullanılıyor? Şimdilik "monthly" yazdım — "trial" ve "yearly" gibi
// başka bir kelime kullanıyorsanız haber verin, tek satır değişir.
// ============================================================
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service_role anahtarı (ANON KEY değil!)
);

// lib/auth.js'deki hashPassword ile BİREBİR AYNI mantık — iki dosyada
// aynı şeyi yazmamak isterseniz oradaki fonksiyonu import edip
// kullanabilirsiniz: import { hashPassword } from "@/lib/auth";
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

// Yeni müşteri için okunabilir, rastgele bir şifre üretir (ör. "k3f9m2xa1q")
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

  // "monthly"/"yearly" bekleniyor — satış sitesi zaten bu kelimelerle gönderiyor.
  // Farklıysa burada bir çeviri satırı eklenir.
  const planDegeri = plan;

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
        plan: planDegeri,
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
    plan: planDegeri,
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
