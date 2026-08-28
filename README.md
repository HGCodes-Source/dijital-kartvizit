# Dijital Kartvizit — Yönetim Panelli SaaS Şablonu

Ekran görüntüsündeki gibi bir dijital kartvizit ürünü: her müşterinin kendi
linkinde (`/kart/kullanici-adi`) açılan, QR kod ve NFC ile paylaşılabilen bir
kartvizit sayfası + müşterinin kendi bilgilerini düzenlediği bir panel +
sizin (admin) müşteri hesaplarını açıp kapattığınız bir yönetim paneli.

## İçindekiler

- **/login** — herkesin giriş yaptığı tek sayfa (admin veya müşteri)
- **/admin** — sizin panelinizdir. Yeni müşteri hesabı açma, URL adresi
  (slug) belirleme, hesabı aktif/pasif etme, şifre sıfırlama, silme.
- **/panel** — müşterinin kendi panelidir. İsim, ünvan, profil fotoğrafı,
  kart rengi ve **istediği bağlantıları seçerek** (telefon, WhatsApp,
  e-posta, web sitesi, konum, Instagram, LinkedIn, X, Facebook, YouTube,
  TikTok, Telegram, özel link) ekleyip sırasını değiştirebilir, gizleyebilir
  ya da silebilir. Sağ tarafta canlı önizleme vardır.
- **/kart/[slug]** — herkese açık kartvizit sayfası. QR kod, "Kartviziti
  Kaydet" (vCard/.vcf indirme — telefon rehberine tek dokunuşla eklenir) ve
  tüm bağlantı butonlarını gösterir.

## Kurulum

```bash
npm install
cp .env.example .env
# .env içindeki SESSION_SECRET değerini mutlaka değiştirin
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine gidin.

### Hazır demo hesaplar (ilk kurulumda `data/db.json` içinde gelir)

| Rol    | E-posta            | Şifre     |
|--------|---------------------|-----------|
| Admin  | admin@example.com   | admin123  |
| Müşteri| demo@example.com    | demo123   |

Demo müşterinin kartviziti: `http://localhost:3000/kart/elif-yilmaz`

**Canlıya almadan önce bu iki şifreyi mutlaka değiştirin veya `data/db.json`
dosyasındaki demo kullanıcıyı silin.**

## Yeni müşteri nasıl eklenir?

1. Admin olarak giriş yapın → `/admin`
2. "Yeni Kullanıcı Ekle" butonuna basın
3. İsim, ünvan, kartvizit URL adresi (ör. `ahmet-kaya`), giriş e-postası ve
   geçici bir şifre girin
4. Oluşturduktan sonra bu e-posta/şifreyi müşteriye iletin — müşteri
   `/login` üzerinden giriş yapıp kendi panelinden kartını düzenler

## NFC ile paylaşım

Uygulama herhangi bir NFC donanımı gerektirmez; NFC kartvizitler zaten boş,
yazılabilir NFC kartlar/etiketlerdir. Yapmanız gereken:

1. Müşterinin kartvizit linkini (`https://siteniz.com/kart/ahmet-kaya`)
   herhangi bir NFC yazma uygulamasıyla (ör. telefonda "NFC Tools" uygulaması)
   boş bir NFC karta/etikete yazmak
2. Karta dokunulduğunda telefon otomatik olarak bu linki açar

QR kod zaten her kartvizit sayfasında otomatik oluşturulur (harici, ücretsiz
bir QR servisi kullanılır — internet bağlantısı gerektirir).

## Önemli: Veritabanı hakkında

Bu proje basitlik için `data/db.json` adlı bir dosyayı veritabanı gibi
kullanır (`lib/db.js` içindeki fonksiyonlar üzerinden). Bu yaklaşım:

- Kendi sunucunuzda (VPS, Docker vb.) veya yerel geliştirmede **sorunsuz
  çalışır.**
- **Vercel gibi "serverless" platformlarda kalıcı değildir** — dosya sistemi
  her istekte sıfırlanabilir. Birden fazla müşteriye satıp production'da
  ciddi şekilde kullanacaksanız, `lib/db.js` içindeki fonksiyonların içini
  (dışa açılan fonksiyon isimlerini değiştirmeden) gerçek bir veritabanına
  (ör. PostgreSQL + Prisma, Supabase, SQLite + Turso) bağlayacak şekilde
  güncellemenizi öneririz. Uygulamanın geri kalanı bu dosyaya dokunmadan
  aynı şekilde çalışmaya devam eder.

## Teknik notlar

- Next.js 14 (App Router) + Tailwind CSS, ekstra state-management kütüphanesi
  yok.
- Kimlik doğrulama: Node'un yerleşik `crypto` modülüyle (scrypt) şifre
  hashleme + imzalı, httpOnly çerez tabanlı oturum. Harici auth paketi
  kullanılmaz.
- Sayfa/işlem yetkilendirmesi: her korumalı sayfa/işlem `requireAdmin()` /
  `requireUser()` ile kontrol edilir.
- Kartvizit güncellemeleri Next.js **Server Actions** ile yapılır — ayrı bir
  API katmanı yazmaya gerek kalmaz.

## Yapı

```
app/
  login/            giriş sayfası + server action
  admin/            yönetici paneli (kullanıcı CRUD)
  panel/            müşteri paneli (kart düzenleme + canlı önizleme)
  kart/[slug]/      herkese açık kartvizit sayfası + vCard indirme
components/
  CardPreview.js    kartvizit görünümü (panel ve public sayfa ortak kullanır)
  IconMap.js        lucide-react ikon eşleştirici
lib/
  db.js             veri erişim katmanı (ileride DB değişimi buradan yapılır)
  auth.js           şifre hash + oturum yönetimi
  platforms.js      desteklenen bağlantı/sosyal medya türleri
  vcard.js          .vcf (vCard) üretimi
data/db.json        veri dosyası
```

## Sırada ne var? (öneriler)

- Profil fotoğrafı yükleme (şu an sadece URL girilebiliyor) — ör. UploadThing
  veya Vercel Blob eklenebilir.
- Admin tarafında paket/plan (ör. "1 yıllık", "yaşam boyu") ve son ödeme
  tarihi takibi.
- Kartvizit görüntülenme/tıklanma istatistikleri.
- Gerçek veritabanına geçiş (yukarıda anlatıldığı gibi).
