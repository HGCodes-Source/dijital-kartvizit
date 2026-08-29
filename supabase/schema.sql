-- ============================================================
-- Dijital Kartvizit - Supabase Şeması
-- Bu dosyanın tamamını Supabase panelinde "SQL Editor" a yapıştırıp
-- "Run" ile bir kere çalıştırman yeterli.
-- ============================================================

create table if not exists public.users (
  id text primary key,
  role text not null check (role in ('admin','user')),
  email text not null,
  password_hash text not null,
  slug text unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  plan text not null default 'trial' check (plan in ('trial','monthly','yearly')),
  expires_at timestamptz,
  card jsonb
);

-- E-postanın büyük/küçük harf farkı gözetmeden benzersiz olması için
create unique index if not exists users_email_unique_idx on public.users (lower(email));
create index if not exists users_slug_idx on public.users (slug);

-- NOT: Uygulama sunucu tarafında "service role" anahtarıyla çalışır,
-- yani tüm sorgular backend üzerinden geçer. Bu nedenle Row Level
-- Security (RLS) varsayılan olarak KAPALI bırakılabilir. İstersen
-- ileride RLS açıp sadece service_role'e izin veren politikalar
-- ekleyebilirsin; günlük kullanım için gerekli değildir.

-- ------------------------------------------------------------
-- Demo hesaplar (aynı .zip'teki README'de anlatılan giriş bilgileri)
--   Admin   : admin@example.com / admin123
--   Müşteri : demo@example.com  / demo123
-- Canlıya geçmeden önce bu şifreleri panelden mutlaka değiştir
-- ya da bu demo kullanıcıyı admin panelinden silebilirsin.
-- ------------------------------------------------------------
insert into public.users (id, role, email, password_hash, slug, active, created_at, plan, expires_at, card)
values
(
  'admin-1',
  'admin',
  'admin@example.com',
  'b1e9f463fd0fb9956ce5db66a139c814:36d50b6e78cc2172ac439902178cc03b359dfe7a5df380c79319b60533b4693ef53505d476a853e2356784069bda02ccab5ad9fdc7d04fdb065f5b567c42d777',
  null,
  true,
  now(),
  'yearly',
  null,
  null
),
(
  'user-1',
  'user',
  'demo@example.com',
  'e63e0e03dc53ae9f7b134b44a4eb63d7:194b1689b4a94eb8de780b9f660914ae367e530ab7e6327938f4d903dd0d8d3e99ad74c54a195c1cf7399ea86bb5b0b566786d2b59ca7bae7aba377de577719e',
  'elif-yilmaz',
  true,
  now(),
  'trial',
  now() + interval '15 days',
  '{
    "name": "Elif Yılmaz",
    "title": "Dijital Pazarlama Uzmanı",
    "company": "",
    "avatarUrl": "",
    "bio": "",
    "theme": "#0F1B33",
    "links": [
      {"id":"l1","platform":"phone","value":"+905551112233","visible":true,"order":1},
      {"id":"l2","platform":"whatsapp","value":"905551112233","visible":true,"order":2},
      {"id":"l3","platform":"email","value":"elif@example.com","visible":true,"order":3},
      {"id":"l4","platform":"instagram","value":"elifyilmaz","visible":true,"order":4},
      {"id":"l5","platform":"linkedin","value":"elifyilmaz","visible":true,"order":5},
      {"id":"l6","platform":"website","value":"https://example.com","visible":true,"order":6},
      {"id":"l7","platform":"location","value":"https://maps.google.com/?q=Istanbul","visible":true,"order":7}
    ]
  }'::jsonb
)
on conflict (id) do nothing;
