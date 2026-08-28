import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "./db";

const SESSION_COOKIE = "kv_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 gun

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET tanimli degil. .env dosyanizi kontrol edin."
    );
  }
  return secret;
}

// ---- Sifre hashleme (node'un yerlesik scrypt'i - ekstra paket gerekmez) ----
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(derived, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ---- Basit imzali oturum tokeni (harici paket gerekmez) ----
function sign(data) {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("hex");
}

function createSessionToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(body);
  return `${body}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const expected = sign(body);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(userId) {
  const token = createSessionToken({
    userId,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const user = getUserById(payload.userId);
  if (!user || user.active === false) return null;
  return user;
}

// Sayfa basinda cagirilir; yetkisi yoksa login'e yonlendirir.
export function requireAdmin() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") redirect("/login");
  return user;
}

export function requireUser() {
  const user = getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
