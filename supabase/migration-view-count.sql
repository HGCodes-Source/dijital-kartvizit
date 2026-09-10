-- ============================================================
-- Dijital Kartvizit - Görüntülenme Sayacı Migration
-- Daha önce schema.sql veya migration-membership.sql'i çalıştırmış
-- olanlar içindir. Mevcut verileri SİLMEZ, sadece görüntülenme
-- sayısını tutan sütunu ve artıran fonksiyonu ekler.
--
-- Supabase panelinde SQL Editor'e yapıştırıp "Run" ile bir kere
-- çalıştırman yeterli.
-- ============================================================

alter table public.users
  add column if not exists view_count integer not null default 0;

create or replace function public.increment_view_count(user_id text)
returns void as $$
  update public.users set view_count = view_count + 1 where id = user_id;
$$ language sql;
