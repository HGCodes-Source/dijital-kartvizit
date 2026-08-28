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

export default function CardPreview({ card, vcardHref, qrValue, slug }) {
  const [copiedId, setCopiedId] = useState(null);
  const links = (card.links || [])
    .filter((l) => l.visible)
    .sort((a, b) => a.order - b.order);
  const iconLinks = links.filter((l) => getPlatform(l.platform).showAsIcon);

  function handleCopy(id, value) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1800);
  }

  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-foilGlow">
      {/* ---- "Fiziksel kart" başlığı ---- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-carbon2 to-carbon px-6 pb-7 pt-5">
        {/* Filigran baş harf */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-[9rem] font-bold leading-none text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg,#E8C9A0,#B8794A)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            opacity: 0.08,
          }}
        >
          {initials(card.name) || "?"}
        </div>

        {/* Çip + temassız simgesi */}
        <div className="relative mb-6 flex items-center justify-between">
          <ChipMark />
          <ContactlessMark />
        </div>

        {/* Avatar */}
        <div className="relative flex flex-col items-center">
          <div className="rounded-full bg-gradient-to-br from-foilStart to-foilEnd p-[2px]">
            {card.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.avatarUrl}
                alt={card.name}
                className="h-16 w-16 rounded-full border-2 border-carbon object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-carbon bg-carbon2 font-display text-lg font-semibold text-foilStart">
                {initials(card.name) || "?"}
              </div>
            )}
          </div>

          <h2 className="mt-3 text-center font-display text-lg font-semibold text-white">
            {card.name || "İsim Soyisim"}
          </h2>
          {card.title && (
            <p className="text-center text-xs text-white/60">{card.title}</p>
          )}
          {card.company && (
            <p className="text-center text-[11px] text-white/35">{card.company}</p>
          )}
          {slug && (
            <p className="mt-1.5 font-mono text-[10px] tracking-wide text-foilStart/70">
              /kart/{slug}
            </p>
          )}

          {iconLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {iconLinks.map((l) => {
                const p = getPlatform(l.platform);
                return (
                  <a
                    key={l.id}
                    href={p.buildUrl(l.value)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] backdrop-blur transition hover:border-foilStart/40 hover:bg-white/10"
                    title={p.label}
                  >
                    <Icon name={p.icon} size={15} className="text-white/90" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ---- Bağlantı listesi ---- */}
      <div className="space-y-2 bg-porcelain px-4 py-4">
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

        {vcardHref && (
          <a
            href={vcardHref}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-foilStart to-foilEnd py-3 text-sm font-semibold text-carbon shadow-sm transition hover:brightness-105"
          >
            <Icon name="Download" size={16} />
            Kartviziti Kaydet
          </a>
        )}

        {qrValue && (
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
