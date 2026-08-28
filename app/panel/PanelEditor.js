"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Icon from "@/components/IconMap";
import CardPreview from "@/components/CardPreview";
import AvatarUploader from "@/components/AvatarUploader";
import { PLATFORM_KEYS, getPlatform } from "@/lib/platforms";
import { saveCardAction, changePasswordAction } from "./actions";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function PanelEditor({ initialCard, slug, baseUrl }) {
  const [card, setCard] = useState(() => ({
    name: initialCard?.name || "",
    title: initialCard?.title || "",
    company: initialCard?.company || "",
    avatarUrl: initialCard?.avatarUrl || "",
    bio: initialCard?.bio || "",
    theme: initialCard?.theme || "#0F1B33",
    links:
      initialCard?.links?.length > 0
        ? initialCard.links
        : [],
  }));
  const [isPending, startTransition] = useTransition();
  const [saveMsg, setSaveMsg] = useState(null);
  const formRef = useRef(null);

  const publicUrl = `${baseUrl}/kart/${slug}`;
  const sortedLinks = useMemo(
    () => [...card.links].sort((a, b) => a.order - b.order),
    [card.links]
  );

  function update(field, value) {
    setCard((c) => ({ ...c, [field]: value }));
  }

  function addLink() {
    setCard((c) => ({
      ...c,
      links: [
        ...c.links,
        {
          id: uid(),
          platform: "custom",
          value: "",
          visible: true,
          order: c.links.length + 1,
        },
      ],
    }));
  }

  function updateLink(id, patch) {
    setCard((c) => ({
      ...c,
      links: c.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }

  function removeLink(id) {
    setCard((c) => ({ ...c, links: c.links.filter((l) => l.id !== id) }));
  }

  function moveLink(id, dir) {
    setCard((c) => {
      const links = [...c.links].sort((a, b) => a.order - b.order);
      const idx = links.findIndex((l) => l.id === id);
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= links.length) return c;
      const a = links[idx];
      const b = links[swapIdx];
      const tmp = a.order;
      a.order = b.order;
      b.order = tmp;
      return { ...c, links };
    });
  }

  function handleSave() {
    setSaveMsg(null);
    const formData = new FormData();
    formData.set("cardJson", JSON.stringify(card));
    startTransition(async () => {
      const res = await saveCardAction(null, formData);
      if (res?.ok) setSaveMsg({ type: "ok", text: "Kaydedildi." });
      else setSaveMsg({ type: "error", text: res?.error || "Hata oluştu." });
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* SOL: form */}
      <div className="space-y-6">
        <section className="rounded-xl2 border border-black/5 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold">Temel Bilgiler</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">
                Ad Soyad
              </label>
              <input
                value={card.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">
                Ünvan / Meslek
              </label>
              <input
                value={card.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">
                Şirket (opsiyonel)
              </label>
              <input
                value={card.company}
                onChange={(e) => update("company", e.target.value)}
                className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">
                Kart Rengi
              </label>
              <input
                type="color"
                value={card.theme}
                onChange={(e) => update("theme", e.target.value)}
                className="h-10 w-full rounded-lg border border-black/10"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-black/5 pt-4">
            <AvatarUploader
              name={card.name}
              value={card.avatarUrl}
              onChange={(v) => update("avatarUrl", v)}
            />
          </div>
        </section>

        <section className="rounded-xl2 border border-black/5 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Bağlantılar &amp; Sosyal Medya
            </h2>
            <button
              onClick={addLink}
              className="flex items-center gap-1 rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink/90"
            >
              <Icon name="Plus" size={14} />
              Bağlantı Ekle
            </button>
          </div>

          {sortedLinks.length === 0 && (
            <p className="rounded-lg bg-black/[0.03] px-4 py-6 text-center text-xs text-slate">
              Henüz bağlantı yok. Telefon, WhatsApp, Instagram, LinkedIn,
              web sitesi gibi istediğin kadar bağlantı ekleyebilirsin.
            </p>
          )}

          <div className="space-y-3">
            {sortedLinks.map((l, i) => {
              const platform = getPlatform(l.platform);
              return (
                <div
                  key={l.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-black/10 p-3"
                >
                  <select
                    value={l.platform}
                    onChange={(e) =>
                      updateLink(l.id, { platform: e.target.value })
                    }
                    className="rounded-lg border border-black/10 px-2 py-2 text-xs outline-none"
                  >
                    {PLATFORM_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {getPlatform(key).label}
                      </option>
                    ))}
                  </select>

                  <input
                    value={l.value}
                    onChange={(e) =>
                      updateLink(l.id, { value: e.target.value })
                    }
                    placeholder={platform.placeholder}
                    className="min-w-[140px] flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs outline-none focus:border-ink"
                  />

                  <button
                    type="button"
                    onClick={() => updateLink(l.id, { visible: !l.visible })}
                    title={l.visible ? "Kartta gizle" : "Kartta göster"}
                    className="rounded-lg border border-black/10 p-2 hover:bg-black/5"
                  >
                    <Icon
                      name={l.visible ? "Eye" : "EyeOff"}
                      size={14}
                      className={l.visible ? "text-green-600" : "text-slate"}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLink(l.id, -1)}
                    disabled={i === 0}
                    className="rounded-lg border border-black/10 p-2 hover:bg-black/5 disabled:opacity-30"
                  >
                    <Icon name="ArrowUp" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLink(l.id, 1)}
                    disabled={i === sortedLinks.length - 1}
                    className="rounded-lg border border-black/10 p-2 hover:bg-black/5 disabled:opacity-30"
                  >
                    <Icon name="ArrowDown" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLink(l.id)}
                    className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-60"
          >
            {isPending ? "Kaydediliyor..." : "Kartviziti Kaydet"}
          </button>
          {saveMsg && (
            <span
              className={`text-xs ${
                saveMsg.type === "ok" ? "text-green-600" : "text-red-600"
              }`}
            >
              {saveMsg.text}
            </span>
          )}
        </div>

        <ChangePasswordBox />
      </div>

      {/* SAĞ: canlı önizleme */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-3 text-center text-xs font-medium text-slate">
          Canlı Önizleme (kartın tasarımı — QR ve kaydet butonu gerçek
          sayfada)
        </p>
        <CardPreview card={card} slug={slug} hideActions />
        <a
          href={`/kart/${slug}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-white hover:bg-ink/90"
        >
          <Icon name="QrCode" size={16} />
          Canlı Sayfayı Aç (QR / paylaşım için)
        </a>
        <p className="mt-3 break-all rounded-lg bg-black/[0.03] px-3 py-2 text-center text-[11px] text-slate">
          {publicUrl}
        </p>
      </div>
    </div>
  );
}

function ChangePasswordBox() {
  const [msg, setMsg] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.target);
    startTransition(async () => {
      const res = await changePasswordAction(null, formData);
      if (res?.ok) {
        setMsg({ type: "ok", text: "Şifre güncellendi." });
        e.target.reset();
      } else {
        setMsg({ type: "error", text: res?.error || "Hata oluştu." });
      }
    });
  }

  return (
    <section className="rounded-xl2 border border-black/5 bg-white p-6">
      <h2 className="mb-4 text-sm font-semibold">Şifreni Değiştir</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <input
          name="currentPassword"
          type="password"
          required
          placeholder="Mevcut şifre"
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
        <input
          name="newPassword"
          type="password"
          required
          placeholder="Yeni şifre"
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
        <button
          disabled={isPending}
          className="sm:col-span-2 w-fit rounded-lg border border-black/10 px-4 py-2 text-xs font-semibold hover:bg-black/5 disabled:opacity-60"
        >
          {isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
        {msg && (
          <p
            className={`sm:col-span-2 text-xs ${
              msg.type === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg.text}
          </p>
        )}
      </form>
    </section>
  );
}
