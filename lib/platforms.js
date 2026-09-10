// Desteklenen tum baglanti/sosyal medya turleri.
// icon: lucide-react ikon adi, buildUrl: kaydedilen deger -> tiklanabilir link

// Kullanicinin 0555..., 555..., +90555..., 90555... gibi farkli sekillerde
// yazdigi numarayi WhatsApp'in bekledigi formata (basinda ulke kodu, + veya 0 yok) cevirir.
function normalizeWhatsappNumber(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return digits;
  if (digits.startsWith("0")) {
    // 05551112233 -> 905551112233
    digits = "90" + digits.slice(1);
  } else if (!digits.startsWith("90") && digits.length === 10) {
    // 5551112233 -> 905551112233
    digits = "90" + digits;
  }
  return digits;
}

export const PLATFORMS = {
  phone: {
    label: "Telefon",
    buttonLabel: "Telefonu Ara",
    icon: "Phone",
    color: "#2563EB",
    placeholder: "+90 555 111 22 33",
    buildUrl: (v) => `tel:${v.replace(/\s/g, "")}`,
    showAsIcon: true,
  },
  whatsapp: {
    label: "WhatsApp",
    buttonLabel: "WhatsApp",
    icon: "MessageCircle",
    color: "#22C55E",
    placeholder: "05551112233 (nasıl yazarsan yaz, otomatik düzeltilir)",
    buildUrl: (v) => `https://wa.me/${normalizeWhatsappNumber(v)}`,
    showAsIcon: true,
  },
  email: {
    label: "E-posta",
    buttonLabel: "E-posta Gönder",
    icon: "Mail",
    color: "#3B82F6",
    placeholder: "ornek@eposta.com",
    buildUrl: (v) => `mailto:${v}`,
    showAsIcon: true,
  },
  website: {
    label: "Web Sitesi",
    buttonLabel: "Web Sitem",
    icon: "Globe",
    color: "#0EA5E9",
    placeholder: "https://siteniz.com",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: false,
  },
  location: {
    label: "Konum",
    buttonLabel: "Konumu Gör",
    icon: "MapPin",
    color: "#EF4444",
    placeholder: "Google Maps linki",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: false,
  },
  googleReview: {
    label: "Google Yorum",
    buttonLabel: "Google'da Yorum Yap",
    icon: "Star",
    color: "#FBBC04",
    placeholder: "Google yorum linkiniz (İşletme Profili > Yorum İste)",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: true,
  },
  booking: {
    label: "Randevu",
    buttonLabel: "Randevu Al",
    icon: "CalendarCheck",
    color: "#4F46E5",
    placeholder: "Randevu linkiniz (Calendly, cal.com vb.)",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: false,
  },
  instagram: {
    label: "Instagram",
    buttonLabel: "Instagram",
    icon: "Instagram",
    color: "#E1306C",
    placeholder: "kullanici.adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://instagram.com/${v}`),
    showAsIcon: true,
  },
  linkedin: {
    label: "LinkedIn",
    buttonLabel: "LinkedIn",
    icon: "Linkedin",
    color: "#0A66C2",
    placeholder: "kullanici-adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://linkedin.com/in/${v}`),
    showAsIcon: true,
  },
  twitter: {
    label: "X / Twitter",
    buttonLabel: "X (Twitter)",
    icon: "Twitter",
    color: "#111827",
    placeholder: "kullanici_adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://x.com/${v}`),
    showAsIcon: true,
  },
  facebook: {
    label: "Facebook",
    buttonLabel: "Facebook",
    icon: "Facebook",
    color: "#1877F2",
    placeholder: "sayfa.adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://facebook.com/${v}`),
    showAsIcon: true,
  },
  youtube: {
    label: "YouTube",
    buttonLabel: "YouTube",
    icon: "Youtube",
    color: "#FF0000",
    placeholder: "@kanaladi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://youtube.com/${v}`),
    showAsIcon: true,
  },
  tiktok: {
    label: "TikTok",
    buttonLabel: "TikTok",
    icon: "Music2",
    color: "#000000",
    placeholder: "@kullanici.adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://tiktok.com/${v}`),
    showAsIcon: true,
  },
  telegram: {
    label: "Telegram",
    buttonLabel: "Telegram",
    icon: "Send",
    color: "#229ED9",
    placeholder: "kullanici_adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://t.me/${v}`),
    showAsIcon: true,
  },
  sahibinden: {
    label: "Sahibinden",
    buttonLabel: "Sahibinden Profilim",
    icon: "Store",
    color: "#FFB600",
    placeholder: "magaza-adi veya profil linki",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://www.sahibinden.com/${v}`),
    showAsIcon: false,
  },
  trendyol: {
    label: "Trendyol",
    buttonLabel: "Trendyol Mağazam",
    icon: "ShoppingBag",
    color: "#F27A1A",
    placeholder: "magaza profil linki",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: false,
  },
  hepsiburada: {
    label: "Hepsiburada",
    buttonLabel: "Hepsiburada Mağazam",
    icon: "ShoppingCart",
    color: "#FF6000",
    placeholder: "magaza profil linki",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: false,
  },
  menu: {
    label: "Menü / Katalog",
    buttonLabel: "Menüyü Görüntüle",
    icon: "FileText",
    color: "#92400E",
    placeholder: "PDF veya menü linki",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: false,
  },
  threads: {
    label: "Threads",
    buttonLabel: "Threads",
    icon: "AtSign",
    color: "#000000",
    placeholder: "kullanici.adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://www.threads.net/@${v}`),
    showAsIcon: true,
  },
  behance: {
    label: "Behance",
    buttonLabel: "Behance",
    icon: "Palette",
    color: "#1769FF",
    placeholder: "kullanici-adi",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://www.behance.net/${v}`),
    showAsIcon: false,
  },
  iban: {
    label: "IBAN / Banka Hesabı",
    buttonLabel: "IBAN'ı Kopyala",
    icon: "Landmark",
    color: "#0F766E",
    placeholder: "TR00 0000 0000 0000 0000 0000 00",
    buildUrl: null,
    copyable: true,
    showAsIcon: false,
  },
  custom: {
    label: "Özel Link",
    buttonLabel: "Bağlantı",
    icon: "Link",
    color: "#6B7280",
    placeholder: "https://...",
    buildUrl: (v) => (v.startsWith("http") ? v : `https://${v}`),
    showAsIcon: false,
  },
};

export const PLATFORM_KEYS = Object.keys(PLATFORMS);

export function getPlatform(key) {
  return PLATFORMS[key] || PLATFORMS.custom;
}
