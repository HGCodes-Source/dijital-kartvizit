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

function slugify(text) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };
  return text
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (m) => map[m] || m)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createUserAction(prevState, formData) {
  requireAdmin();

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const title = String(formData.get("title") || "").trim();
  let slug = slugify(String(formData.get("slug") || "") || name);

  if (!email || !password || !name || !slug) {
    return { error: "E-posta, şifre, isim ve URL adresi zorunludur." };
  }
  if (emailExists(email)) {
    return { error: "Bu e-posta ile kayıtlı bir kullanıcı zaten var." };
  }
  let finalSlug = slug;
  let n = 2;
  while (slugExists(finalSlug)) {
    finalSlug = `${slug}-${n}`;
    n++;
  }

  createUser({
    id: `user-${Date.now()}`,
    role: "user",
    email,
    passwordHash: hashPassword(password),
    slug: finalSlug,
    active: true,
    createdAt: new Date().toISOString(),
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
  requireAdmin();
  const id = String(formData.get("id"));
  const user = getUserById(id);
  if (!user) return { error: "Kullanıcı bulunamadı." };

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  let slug = slugify(String(formData.get("slug") || ""));

  if (email && emailExists(email, id)) {
    return { error: "Bu e-posta başka bir kullanıcıda kayıtlı." };
  }
  if (slug && slugExists(slug, id)) {
    return { error: "Bu URL adresi başka bir kullanıcı tarafından kullanılıyor." };
  }

  const patch = {};
  if (email) patch.email = email;
  if (slug) patch.slug = slug;
  if (password) patch.passwordHash = hashPassword(password);

  updateUser(id, patch);
  revalidatePath("/admin");
  revalidatePath(`/admin/users/${id}`);
  redirect("/admin");
}

export async function toggleActiveAction(formData) {
  requireAdmin();
  const id = String(formData.get("id"));
  const user = getUserById(id);
  if (!user) return;
  updateUser(id, { active: !user.active });
  revalidatePath("/admin");
}

export async function deleteUserAction(formData) {
  requireAdmin();
  const id = String(formData.get("id"));
  deleteUser(id);
  revalidatePath("/admin");
  redirect("/admin");
}
