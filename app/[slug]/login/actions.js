"use server";

import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { isExpired } from "@/lib/subscription";

// slug, useActionState ile kullanmak icin bind() ile onceden baglanan ilk parametre.
export async function loginActionForSlug(slug, prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const user = await getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-posta veya şifre hatalı." };
  }
  if (user.active === false) {
    if (isExpired(user)) {
      return {
        error:
          "Deneme süreniz veya üyeliğiniz sona erdi. Yeniden üyelik almak için yöneticinizle iletişime geçin.",
      };
    }
    return {
      error: "Bu hesap devre dışı bırakılmış. Yöneticinizle iletişime geçin.",
    };
  }
  if (user.role !== "user" || user.slug !== slug) {
    return {
      error:
        "Bu giriş sayfası size ait değil. Lütfen size özel gönderilen giriş adresini kullanın.",
    };
  }

  await setSessionCookie(user.id);
  redirect("/panel");
}
