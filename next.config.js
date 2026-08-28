/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Profil fotoğrafı tarayıcıda küçültülüp base64 olarak gönderiliyor;
      // varsayılan 1MB limiti bunun için biraz dar, güvenli pay bırakıyoruz.
      bodySizeLimit: "4mb",
    },
  },
};
module.exports = nextConfig;
