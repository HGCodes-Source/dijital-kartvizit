"use client";

import { useState } from "react";
import Icon from "./IconMap";
import { getPlatform } from "@/lib/platforms";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// Secilen kart rengini acar/koyulastirir (gradyan icin iki ton uretmek amacli).
function shade(hex, percent) {
  const clean = /^#([0-9a-f]{6})$/i.test(hex) ? hex : "#0F1B33";
  const f = parseInt(clean.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}

function ContactlessMark({ className = "" }) {
  return (
    <span className={`relative flex h-5 w-5 items-center justify-center ${className}`}>
      <span className="nfc-ring absolute inline-block h-5 w-5 rounded-full border border-foilStart/70" />
      <span className="nfc-ring delay absolute inline-block h-3.5 w-3.5 rounded-full border border-foilStart/70" />
      <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-foilStart" />
    </span>
  );
}

function ChipMark() {
  return (
    <div className="relative h-6 w-8 overflow-hidden rounded-[4px] bg-gradient-to-br from-foilStart to-foilEnd">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/20" />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/20" />
      <div className="absolute inset-y-0 left-1/4 w-px bg-black/10" />
      <div className="absolute inset-y-0 left-3/4 w-px bg-black/10" />
    </div>
  );
}

export default function CardPreview({ card, vcardHref, qrValue, slug, hideActions }) {
  const [copiedId, setCopiedId] = useState(null);
  const links = (card.links || [])
    .filter((l) => l.visible)
    .sort((a, b) => a.order - b.order);
  const iconLinks = links.filter((l) => getPlatform(l.platform).showAsIcon);

  const baseTheme = card.theme || "#0F1B33";
  const themeLight = shade(baseTheme, 0.18);
  const themeDark = shade(baseTheme, -0.35);

  function handleCopy(id, value) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1800);
  }

  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-foilGlow">
      {/* ---- "Fiziksel kart" başlığı — gerçek kart oranında (1.586:1) ---- */}
      <div
        className="relative flex w-full flex-col justify-between overflow-hidden px-5 py-4"
        style={{
          background: `linear-gradient(135deg, ${themeLight}, ${themeDark})`,
          aspectRatio: "1.586 / 1",
        }}
      >
        {/* Filigran baş harf */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-4 select-none font-display text-[6.5rem] font-bold leading-none text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg,#E8C9A0,#B8794A)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            opacity: 0.09,
          }}
        >
          {initials(card.name) || "?"}
        </div>

        {/* Çip + temassız simgesi */}
        <div className="relative flex items-center justify-between">
          <ChipMark />
          <ContactlessMark />
        </div>

        {/* Avatar + isim (yatay - gerçek karttaki gibi) */}
        <div className="relative flex items-center gap-3">
          <div className="shrink-0 rounded-full bg-gradient-to-br from-foilStart to-foilEnd p-[2px]">
            {card.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.avatarUrl}
                alt={card.name}
                className="h-12 w-12 rounded-full border-2 object-cover"
                style={{ borderColor: themeDark }}
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 font-display text-base font-semibold text-foilStart"
                style={{ borderColor: themeDark, backgroundColor: themeLight }}
              >
                {initials(card.name) || "?"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-display text-base font-semibold text-white">
              {card.name || "İsim Soyisim"}
            </h2>
            {card.title && (
              <p className="truncate text-xs text-white/60">{card.title}</p>
            )}
            {card.company && (
              <p className="truncate text-[10px] text-white/35">
                {card.company}
              </p>
            )}
            {slug && (
              <p className="mt-0.5 truncate font-mono text-[9px] tracking-wide text-foilStart/70">
                /kart/{slug}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Sosyal ikon satırı (kartın hemen altında) ---- */}
      {iconLinks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 bg-porcelain px-4 pt-4">
          {iconLinks.map((l) => {
            const p = getPlatform(l.platform);
            return (
              <a
                key={l.id}
                href={p.buildUrl(l.value)}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:brightness-95"
                style={{ backgroundColor: `${p.color}1A` }}
                title={p.label}
              >
                <Icon name={p.icon} size={15} style={{ color: p.color }} />
              </a>
            );
          })}
        </div>
      )}

      {/* ---- Bağlantı listesi ---- */}
      <div className="space-y-2 bg-porcelain px-4 pb-4 pt-3">
        {links.length === 0 && (
          <p className="py-6 text-center text-xs text-slate">
            Henüz eklenmiş bir bağlantı yok.
          </p>
        )}
        {links.map((l) => {
          const p = getPlatform(l.platform);

          if (p.copyable) {
            const isCopied = copiedId === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => handleCopy(l.id, l.value)}
                className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${p.color}1A` }}
                  >
                    <Icon name={p.icon} size={16} style={{ color: p.color }} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{p.buttonLabel}</span>
                    <span className="font-mono text-[11px] text-slate">{l.value}</span>
                  </span>
                </span>
                <Icon
                  name={isCopied ? "Check" : "Copy"}
                  size={16}
                  className={isCopied ? "text-green-600" : "text-slate"}
                />
              </button>
            );
          }

          return (
            <a
              key={l.id}
              href={p.buildUrl(l.value)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${p.color}1A` }}
                >
                  <Icon name={p.icon} size={16} style={{ color: p.color }} />
                </span>
                <span className="text-sm font-medium">{p.buttonLabel}</span>
              </span>
              <Icon name="ChevronRight" size={16} className="text-slate" />
            </a>
          );
        })}

        {!hideActions && vcardHref && (
          <a
            href={vcardHref}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-foilStart to-foilEnd py-3 text-sm font-semibold text-carbon shadow-sm transition hover:brightness-105"
          >
            <Icon name="Download" size={16} />
            Kartviziti Kaydet
          </a>
        )}

        {!hideActions && qrValue && (
          <div className="flex flex-col items-center gap-2 pt-3">
            <div className="rounded-xl border border-black/5 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrValue
                )}`}
                alt="QR kod"
                width={132}
                height={132}
                className="rounded-lg"
              />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-slate">
              Telefonla okutarak kartviziti aç
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
