# Dijital Kartvizit — Yönetim Panelli SaaS Şablonu

Her müşterinin kendi linkinde (`/kart/kullanici-adi`) açılan, QR kod ve
NFC ile paylaşılabilen bir kartvizit sayfası + müşterinin kendi bilgilerini
düzenlediği bir panel + sizin (admin) müşteri hesaplarını açıp kapattığınız
bir yönetim paneli.

## İçindekiler

- **/login** — herkesin giriş yaptığı tek sayfa (admin veya müşteri)
- **/admin** — sizin panelinizdir. Yeni müşteri hesabı açma, URL adresi
  (slug) belirleme, hesabı aktif/pasif etme, şifre sıfırlama, silme.
- **/panel** — müşterinin kendi panelidir. İsim, ünvan, profil fotoğrafı
  (yükleyerek), kart rengi ve **istediği bağlantıları seçerek** (telefon,
  WhatsApp, e-posta, web sitesi, konum, Instagram, LinkedIn, X, Facebook,
  YouTube, TikTok, Telegram, Sahibinden, IBAN, özel link) ekleyip sırasını
  değiştirebilir, gizleyebilir ya da silebilir. Sağ tarafta canlı önizleme
  vardır.
- **/kart/[slug]** — herkese açık kartvizit sayfası. QR kod, "Kartviziti
  Kaydet" (vCard/.vcf indirme) ve tüm bağlantı butonlarını gösterir. IBAN
  eklenmişse "kopyala" butonu olarak görünür.

## Kurulum

```bash
npm install
cp .env.example .env
```

### 1) Supabase projesi oluştur (ücretsiz)

1. [supabase.com](https://supabase.com) → ücretsiz hesap aç → "New Project"
2. Proje oluşunca sol menüden **SQL Editor**'e gir, bu projedeki
   **`supabase/schema.sql`** dosyasının tamamını kopyala-yapıştır ve
   **Run**'a bas. Bu, `users` tablosunu ve demo hesapları oluşturur.
3. Sol menüden **Project Settings → API**'ye gir:
   - **Project URL** değerini kopyala → `.env` dosyasında `SUPABASE_URL`
   - **service_role** anahtarını kopyala (⚠️ **anon key** değil,
     **service_role** — gizli, tam yetkili anahtar) → `.env` dosyasında
     `SUPABASE_SERVICE_ROLE_KEY`

### 2) .env dosyasını tamamla

`.env` içindeki `SESSION_SECRET` değerini rastgele uzun bir metinle
değiştir, `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` değerlerini
yukarıdan yapıştır.

### 3) Çalıştır

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine gidin.

### Vercel'e deploy ederken

Vercel projende **Settings → Environment Variables** kısmına `.env`
dosyandaki **4 değişkenin aynısını** (`SESSION_SECRET`,
`NEXT_PUBLIC_BASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) tek
tek ekle, sonra yeniden deploy et. `NEXT_PUBLIC_BASE_URL`'i gerçek
domain'inle (`https://siteniz.com`) güncellemeyi unutma.

### Hazır demo hesaplar (schema.sql ile otomatik oluşur)

| Rol    | E-posta            | Şifre     |
|--------|---------------------|-----------|
| Admin  | admin@example.com   | admin123  |
| Müşteri| demo@example.com    | demo123   |

Demo müşterinin kartviziti: `http://localhost:3000/kart/elif-yilmaz`

**Canlıya almadan önce bu iki şifreyi mutlaka değiştirin veya admin
panelinden demo müşteriyi silin.**

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

## Veritabanı: Supabase (Postgres)

Proje **Supabase** (Postgres tabanlı, yönetilen bir veritabanı servisi)
kullanır — `lib/db.js` tüm okuma/yazma işlemlerini
`@supabase/supabase-js` üzerinden yapar. Neden bu şekilde:

- Önceki sürüm `data/db.json` adlı bir dosyaya yazıyordu. Bu, kendi
  sunucunuzda (VPS) sorunsuz çalışır ama **Vercel gibi "serverless"
  platformlarda dosya sistemi salt-okunur/geçicidir** — yeni kullanıcı
  eklemeye çalıştığınızda sunucu hatası (`This page couldn't load`)
  alırsınız. Supabase gerçek, kalıcı bir veritabanı olduğu için bu
  sorunu tamamen ortadan kaldırır.
- Ücretsiz Supabase planı (500 MB veritabanı) **1000 müşteriye kadar**
  rahatlıkla yeter; kartvizit verileri çok küçük boyutludur.
- Tüm sorgular sunucu tarafında **service_role** anahtarıyla yapılır, bu
  anahtar tarayıcıya hiç gönderilmez (güvenlidir).

Tablo yapısı tek bir `users` tablosudur; her satırda kullanıcının temel
bilgileri (e-posta, şifre hash'i, slug, aktif/pasif) ve kartvizit
verisinin tamamı (`card` sütunu, JSONB) bulunur. Detaylar için
`supabase/schema.sql` dosyasına bakabilirsiniz.

## Üyelik / Deneme Süresi Sistemi

Ödeme entegrasyonu **yok** (bilerek) — üyelik tamamen admin tarafından elle
veriliyor. Şu şekilde çalışır:

- **Yeni müşteri eklendiğinde** otomatik olarak **15 günlük ücretsiz deneme**
  başlar.
- Admin panelinde her müşterinin yanında **"1 Aylık Ver"** / **"1 Yıllık
  Ver"** butonları var — bastığında müşterinin üyeliği o kadar uzatılır
  (hesabın hâlâ süresi varsa mevcut bitiş tarihinin üzerine eklenir, süresi
  dolmuşsa bugünden başlar) ve hesap otomatik olarak yeniden aktif olur.
- **Süre dolduğunda** müşterinin kartviziti otomatik olarak pasif hale
  gelir: hem her erişimde anlık kontrol edilir (müşteri giriş yapmaya
  çalıştığında, kartvizit sayfası görüntülendiğinde, admin listesi
  açıldığında), hem de **her gün 03:00'te** çalışan bir Vercel Cron görevi
  (`/api/cron/deactivate-expired`) tüm süresi dolmuş hesapları toplu olarak
  tarayıp pasife çeker — kimse siteye girmese bile.
- Pasif hale gelen bir kartvizitin linkine (QR dahil) gidildiğinde boş bir
  404 yerine **"Bu kartvizit şu anda aktif değil"** diye şık, markalı bir
  sayfa gösterilir.

### Mevcut (canlıdaki) veritabanına bu özelliği eklemek

Daha önce `supabase/schema.sql`'i çalıştırıp elinde zaten müşteri verisi
varsa, **schema.sql'i tekrar çalıştırma** (yeniden eklemeye çalışır, hata
verebilir). Onun yerine sadece şunu çalıştır:

1. Supabase panelinde **SQL Editor**'e gir
2. Bu projedeki **`supabase/migration-membership.sql`** dosyasının
   tamamını yapıştır, **Run**'a bas
3. Bu, mevcut verileri SİLMEDEN sadece `plan` ve `expires_at` sütunlarını
   ekler; var olan müşterilere kayıt tarihlerinden itibaren 15 günlük
   deneme süresi tanımlar

Yeni bir kurulum yapıyorsan (hiç veri yoksa) sadece güncel
`supabase/schema.sql`'i çalıştırman yeterli, migration dosyasına gerek yok.

### Günlük otomatik kontrol (Vercel Cron) kurulumu

1. Vercel projenizde **Settings → Environment Variables**'a
   `CRON_SECRET` adında, rastgele uzun bir metin değeri olan yeni bir
   değişken ekleyin (Production için)
2. `vercel.json` dosyası (projede zaten var) Vercel'e bu görevi günde bir
   kez (`03:00`) otomatik çalıştırmasını söylüyor — ekstra bir kurulum
   gerekmiyor, deploy ettiğinizde Vercel bunu kendi algılar
3. Vercel panelinde **Settings → Cron Jobs** kısmından görevin
   listelendiğini ve çalıştığını kontrol edebilirsiniz



## Teknik notlar

- Next.js 14 (App Router) + Tailwind CSS, ekstra state-management kütüphanesi
  yok.
- Kimlik doğrulama: Node'un yerleşik `crypto` modülüyle (scrypt) şifre
  hashleme + imzalı, httpOnly çerez tabanlı oturum. Harici auth paketi
  kullanılmaz.
- Veritabanı: Supabase (Postgres), `@supabase/supabase-js` istemcisiyle,
  sadece sunucu tarafında.
- Sayfa/işlem yetkilendirmesi: her korumalı sayfa/işlem `requireAdmin()` /
  `requireUser()` ile kontrol edilir (asenkron fonksiyonlardır, `await`
  ile çağrılır).
- Kartvizit güncellemeleri Next.js **Server Actions** ile yapılır — ayrı bir
  API katmanı yazmaya gerek kalmaz.
- Profil fotoğrafı: tarayıcıda küçültülüp (max 480px, JPEG) base64 olarak
  `card.avatarUrl` alanına, dolayısıyla veritabanına kaydedilir — ayrı bir
  dosya depolama servisi gerekmez. Çok sayıda/çok yüksek çözünürlüklü
  fotoğraf biriktiğinde ileride Supabase Storage'a geçmek isteyebilirsiniz.

## Yapı

```
app/
  login/            giriş sayfası + server action (admin ve genel giriş)
  [slug]/login/     müşteriye özel, kişiselleştirilmiş giriş sayfası
  admin/            yönetici paneli (kullanıcı CRUD + üyelik yönetimi)
  panel/            müşteri paneli (kart düzenleme + canlı önizleme)
  kart/[slug]/      herkese açık kartvizit sayfası + vCard indirme
  api/cron/         günlük "süresi dolan üyelikleri pasife çek" görevi
  not-found.js      404 sayfası
  error.js          beklenmedik hata sayfası
components/
  CardPreview.js       kartvizit görünümü (panel ve public sayfa ortak kullanır)
  AvatarUploader.js    profil fotoğrafı yükleme (küçültme/sıkıştırma dahil)
  IconMap.js           lucide-react ikon eşleştirici
  IdleLogout.js        hareketsizlikte otomatik oturum kapatma
  SubscriptionBadge.js üyelik durumu rozeti + "üyelik ver" butonları
lib/
  db.js             Supabase üzerinden veri erişim katmanı
  supabaseClient.js Supabase client (service role, sunucu-only)
  auth.js           şifre hash + oturum yönetimi (asenkron)
  subscription.js   deneme/üyelik süresi hesaplamaları
  platforms.js      desteklenen bağlantı/sosyal medya türleri (IBAN dahil)
  vcard.js          .vcf (vCard) üretimi
supabase/
  schema.sql              yeni kurulum için tam şema + demo veri
  migration-membership.sql mevcut veritabanına üyelik sütunlarını ekler
vercel.json         günlük cron görevi zamanlaması
```

## Sırada ne var? (öneriler)

- Admin tarafında paket/plan (ör. "1 yıllık", "yaşam boyu") ve son ödeme
  tarihi takibi.
- Kartvizit görüntülenme/tıklanma istatistikleri.
- Çok sayıda/yüksek çözünürlüklü fotoğraf biriktirirse Supabase Storage'a
  (veya benzeri bir dosya deposuna) geçiş.
