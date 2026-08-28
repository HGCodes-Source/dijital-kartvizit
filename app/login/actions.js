"use server";

import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-posta veya şifre hatalı." };
  }
  if (user.active === false) {
    return { error: "Bu hesap devre dışı bırakılmış. Yöneticinizle iletişime geçin." };
  }

  await setSessionCookie(user.id);
  redirect(user.role === "admin" ? "/admin" : "/panel");
}
