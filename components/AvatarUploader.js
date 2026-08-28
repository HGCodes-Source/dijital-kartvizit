"use client";

import { useRef, useState } from "react";
import Icon from "./IconMap";

const MAX_DIMENSION = 480; // px, en uzun kenar
const JPEG_QUALITY = 0.82;
const MAX_ORIGINAL_MB = 10;

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// Seçilen görseli tarayıcıda (sunucuya göndermeden) küçültüp sıkıştırır.
// Böylece hem yükleme hızlı olur hem de data/db.json aşırı büyümez.
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Görsel işlenemedi."));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function AvatarUploader({ name, value, onChange }) {
  const inputRef = useRef(null);
  const [showUrlField, setShowUrlField] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // aynı dosyayı tekrar seçebilmek için
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir görsel dosyası seçin (jpg, png, webp).");
      return;
    }
    if (file.size > MAX_ORIGINAL_MB * 1024 * 1024) {
      setError(`Dosya çok büyük. En fazla ${MAX_ORIGINAL_MB} MB olmalı.`);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const dataUrl = await resizeImage(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message || "Görsel işlenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate">
        Profil Fotoğrafı
      </label>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-porcelain">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Profil fotoğrafı" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-slate">
              {initials(name) || "?"}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5 disabled:opacity-60"
            >
              <Icon name="Camera" size={14} />
              {loading ? "Yükleniyor..." : value ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Icon name="X" size={14} />
                Kaldır
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowUrlField((s) => !s)}
            className="text-left text-[11px] text-slate underline decoration-dotted hover:text-ink"
          >
            {showUrlField ? "URL alanını gizle" : "veya bir görsel bağlantısı (URL) yapıştır"}
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {showUrlField && (
        <input
          value={value?.startsWith("data:") ? "" : value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-1 text-[11px] text-slate">
        Yüklenen fotoğraf otomatik olarak küçültülür. JPG/PNG, en fazla {MAX_ORIGINAL_MB} MB.
      </p>
    </div>
  );
}
