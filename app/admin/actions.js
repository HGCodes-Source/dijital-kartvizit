"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  slugExists,
  emailExists,
} from "@/lib/db";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { trialExpiryFromNow, computeNewExpiry } from "@/lib/subscription";

function slugify(text) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };
  return text
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (m) => map[m] || m)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createUserAction(prevState, formData) {
  await requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const title = String(formData.get("title") || "").trim();
  let slug = slugify(String(formData.get("slug") || "") || name);

  if (!email || !password || !name || !slug) {
    return { error: "E-posta, şifre, isim ve URL adresi zorunludur." };
  }
  if (await emailExists(email)) {
    return { error: "Bu e-posta ile kayıtlı bir kullanıcı zaten var." };
  }
  let finalSlug = slug;
  let n = 2;
  while (await slugExists(finalSlug)) {
    finalSlug = `${slug}-${n}`;
    n++;
  }

  await createUser({
    id: `user-${Date.now()}`,
    role: "user",
    email,
    passwordHash: hashPassword(password),
    slug: finalSlug,
    active: true,
    createdAt: new Date().toISOString(),
    plan: "trial",
    expiresAt: trialExpiryFromNow(),
    card: {
      name,
      title,
      company: "",
      avatarUrl: "",
      bio: "",
      theme: "#0F1B33",
      links: [],
    },
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateUserAction(prevState, formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const user = await getUserById(id);
  if (!user) return { error: "Kullanıcı bulunamadı." };

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  let slug = slugify(String(formData.get("slug") || ""));

  if (email && (await emailExists(email, id))) {
    return { error: "Bu e-posta başka bir kullanıcıda kayıtlı." };
  }
  if (slug && (await slugExists(slug, id))) {
    return { error: "Bu URL adresi başka bir kullanıcı tarafından kullanılıyor." };
  }

  const patch = {};
  if (email) patch.email = email;
  if (slug) patch.slug = slug;
  if (password) patch.passwordHash = hashPassword(password);

  await updateUser(id, patch);
  revalidatePath("/admin");
  revalidatePath(`/admin/users/${id}`);
  redirect("/admin");
}

export async function toggleActiveAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const user = await getUserById(id);
  if (!user) return;
  await updateUser(id, { active: !user.active });
  revalidatePath("/admin");
}

export async function deleteUserAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await deleteUser(id);
  revalidatePath("/admin");
  redirect("/admin");
}

// Admin bir musteriye elle "Aylik" veya "Yillik" uyelik verir.
// Hesabin hala suresi varsa mevcut bitis tarihinin uzerine ekler,
// suresi dolmussa bugunden itibaren baslatir; ayrica hesabi aktif eder.
export async function grantMembershipAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const plan = String(formData.get("plan"));
  if (!["monthly", "yearly"].includes(plan)) return;

  const user = await getUserById(id);
  if (!user) return;

  const newExpiry = computeNewExpiry(user.expiresAt, plan);
  await updateUser(id, { plan, expiresAt: newExpiry, active: true });

  revalidatePath("/admin");
  revalidatePath(`/admin/users/${id}`);
}
