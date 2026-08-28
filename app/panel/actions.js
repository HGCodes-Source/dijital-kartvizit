"use server";

import { revalidatePath } from "next/cache";
import { requireUser, hashPassword, verifyPassword } from "@/lib/auth";
import { updateUser } from "@/lib/db";

export async function saveCardAction(prevState, formData) {
  const user = await requireUser();
  const raw = String(formData.get("cardJson") || "{}");

  let card;
  try {
    card = JSON.parse(raw);
  } catch {
    return { error: "Kart verisi okunamadı.", ok: false };
  }

  if (!card.name || !card.name.trim()) {
    return { error: "İsim alanı boş bırakılamaz.", ok: false };
  }

  await updateUser(user.id, {
    card: {
      name: card.name || "",
      title: card.title || "",
      company: card.company || "",
      avatarUrl: card.avatarUrl || "",
      bio: card.bio || "",
      theme: card.theme || "#0F1B33",
      links: Array.isArray(card.links) ? card.links : [],
    },
  });

  revalidatePath("/panel");
  revalidatePath(`/kart/${user.slug}`);
  return { error: null, ok: true, savedAt: Date.now() };
}

export async function changePasswordAction(prevState, formData) {
  const user = await requireUser();
  const current = String(formData.get("currentPassword") || "");
  const next = String(formData.get("newPassword") || "");

  if (!verifyPassword(current, user.passwordHash)) {
    return { error: "Mevcut şifre yanlış." };
  }
  if (next.length < 6) {
    return { error: "Yeni şifre en az 6 karakter olmalı." };
  }

  await updateUser(user.id, { passwordHash: hashPassword(next) });
  return { error: null, ok: true };
}
