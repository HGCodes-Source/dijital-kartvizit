import { getSupabaseAdmin } from "./supabaseClient";

// Bu dosya artik Supabase (Postgres) kullanir - basit dosya tabanli
// veritabaninin yerini almistir. Uygulamanin geri kalani hala sadece
// buradaki fonksiyonlari cagirir; baska hicbir yer dogrudan Supabase'e
// erismez. TUM fonksiyonlar asenkron oldugu icin cagrildiklari her
// yerde `await` kullanilmasi gerekir.

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    passwordHash: row.password_hash,
    slug: row.slug,
    active: row.active,
    createdAt: row.created_at,
    card: row.card || null,
  };
}

function toRow(obj) {
  const row = {};
  if (obj.id !== undefined) row.id = obj.id;
  if (obj.role !== undefined) row.role = obj.role;
  if (obj.email !== undefined) row.email = obj.email;
  if (obj.passwordHash !== undefined) row.password_hash = obj.passwordHash;
  if (obj.slug !== undefined) row.slug = obj.slug;
  if (obj.active !== undefined) row.active = obj.active;
  if (obj.createdAt !== undefined) row.created_at = obj.createdAt;
  if (obj.card !== undefined) row.card = obj.card;
  return row;
}

export async function getUsers() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data || []).map(mapRow);
}

export async function getUserById(id) {
  if (!id) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function getUserByEmail(email) {
  if (!email) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .ilike("email", email)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function getUserBySlug(slug) {
  if (!slug) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function createUser(userData) {
  const supabase = getSupabaseAdmin();
  const row = toRow(userData);
  const { data, error } = await supabase
    .from("users")
    .insert(row)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateUser(id, patch) {
  const supabase = getSupabaseAdmin();
  const row = toRow(patch);
  const { data, error } = await supabase
    .from("users")
    .update(row)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function deleteUser(id) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function slugExists(slug, excludeId) {
  if (!slug) return false;
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return (count || 0) > 0;
}

export async function emailExists(email, excludeId) {
  if (!email) return false;
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .ilike("email", email);
  if (excludeId) query = query.neq("id", excludeId);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return (count || 0) > 0;
}
