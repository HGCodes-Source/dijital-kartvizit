"use server";

import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/auth";

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

// "Çıkış Yap" butonundan farklı olarak yönlendirme yapmaz — oturum
// zaman aşımı gibi durumlarda yönlendirmeyi istemci tarafında biz yapıyoruz.
export async function clearSessionAction() {
  await clearSessionCookie();
}
