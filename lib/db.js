import initialData from "../data/db.json";

function readDb() {
  return initialData || { users: [], cards: [] };
}

function writeDb(db) {
  // Vercel serverless ortamında dosya sistemine yazma yapılamaz.
  console.warn("Vercel ortamında veri diske yazılamaz.");
}

export function getUsers() {
  return readDb().users || [];
}

export function getUserById(id) {
  return readDb().users?.find((u) => String(u.id) === String(id)) || null;
}

export function getUserByEmail(email) {
  return readDb().users?.find((u) => u.email?.toLowerCase() === email?.toLowerCase()) || null;
}