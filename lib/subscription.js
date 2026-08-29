// Deneme surumu ve uyelik (abonelik) ile ilgili tum hesaplamalar burada.
// Odeme entegrasyonu yok - admin panelinden elle uyelik veriliyor.

const DAY_MS = 24 * 60 * 60 * 1000;

export const PLAN_DURATIONS_DAYS = {
  trial: 15,
  monthly: 30,
  yearly: 365,
};

export const PLAN_LABELS = {
  trial: "Deneme Sürümü",
  monthly: "Aylık Üyelik",
  yearly: "Yıllık Üyelik",
};

// Yeni musteri olusturulurken kullanilir: 15 gunluk deneme baslangici.
export function trialExpiryFromNow() {
  return new Date(Date.now() + PLAN_DURATIONS_DAYS.trial * DAY_MS).toISOString();
}

// Admin "Aylik/Yillik uyelik ver" dedigindeki yeni bitis tarihini hesaplar.
// Hesabin hala suresi varsa mevcut bitis tarihinin uzerine ekler (haksizlik olmasin diye),
// suresi dolmussa bugunden itibaren baslatir.
export function computeNewExpiry(currentExpiresAt, plan) {
  const days = PLAN_DURATIONS_DAYS[plan];
  if (!days) throw new Error(`Geçersiz plan: ${plan}`);
  const now = Date.now();
  const currentTs = currentExpiresAt ? new Date(currentExpiresAt).getTime() : 0;
  const base = currentTs > now ? currentTs : now;
  return new Date(base + days * DAY_MS).toISOString();
}

export function isExpired(user) {
  if (!user?.expiresAt) return false;
  return new Date(user.expiresAt).getTime() < Date.now();
}

// Pozitif: kalan gun sayisi. Negatif: kac gun once suresi dolmus.
export function daysRemaining(user) {
  if (!user?.expiresAt) return null;
  const diffMs = new Date(user.expiresAt).getTime() - Date.now();
  return Math.ceil(diffMs / DAY_MS);
}

export function formatExpiryDate(expiresAt) {
  if (!expiresAt) return "—";
  return new Date(expiresAt).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
