-- ============================================================
-- Dijital Kartvizit - Üyelik/Deneme Süresi Migration
-- Bu dosya, DAHA ÖNCE supabase/schema.sql'i çalıştırıp elinde zaten
-- veri (müşteriler) olan projeler içindir. Mevcut verileri SİLMEZ,
-- sadece eksik olan iki sütunu (plan, expires_at) ekler.
--
-- Supabase panelinde SQL Editor'e yapıştırıp "Run" ile bir kere
-- çalıştırman yeterli. Zaten çalıştırılmışsa tekrar çalıştırmak
-- güvenlidir (hata vermez, bir şeyi bozmaz).
-- ============================================================

alter table public.users
  add column if not exists plan text not null default 'trial'
    check (plan in ('trial','monthly','yearly')),
  add column if not exists expires_at timestamptz;

-- Halihazırda var olan müşteri hesaplarına (expires_at boş olanlara)
-- kayıt tarihinden itibaren 15 günlük bir deneme süresi tanımlar.
-- Zaten bir bitiş tarihi olanlara dokunmaz.
update public.users
set expires_at = coalesce(created_at, now()) + interval '15 days'
where role = 'user' and expires_at is null;

-- Admin hesabının süresi hiç dolmasın (expires_at NULL = süresiz).
update public.users
set plan = 'yearly'
where role = 'admin' and plan = 'trial';
