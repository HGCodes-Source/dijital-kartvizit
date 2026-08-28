export function buildVCard(card) {
  const phone = card.links?.find((l) => l.platform === "phone" && l.visible);
  const email = card.links?.find((l) => l.platform === "email" && l.visible);
  const website = card.links?.find((l) => l.platform === "website" && l.visible);

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${card.name || ""}`,
    `TITLE:${card.title || ""}`,
    card.company ? `ORG:${card.company}` : null,
    phone ? `TEL;TYPE=CELL:${phone.value}` : null,
    email ? `EMAIL:${email.value}` : null,
    website ? `URL:${website.value}` : null,
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\n");
}
