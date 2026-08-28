import fs from "fs";
import path from "path";

// NOT: Bu basit dosya-tabanli veritabani gelistirme / tek sunucu (VPS) kullanimi icindir.
// Vercel gibi salt-okunur / sunucusuz ortamlarda kalici degildir.
// Ileride buradaki fonksiyonlarin ic gövdesini degistirerek gercek bir veritabanina (Postgres, SQLite vb.) gecebilirsiniz.
// Uygulamanin geri kalani sadece bu dosyadaki fonksiyonlari cagirir, baska hicbir yer dogrudan dosya okumaz.

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function readDb() {try{
  if(fs.existsSync(DB_PATH)){
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  }
} catch(error){
  console.error("DB Okuma hatası:", error);
}
//dosya bulunamazsa yada okunamazsa uygulamanın patlamaması için yapılan yapı.
  return JSON.parse(raw);
}

function writeDb(db) {
  try{
     fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.warn("Vercel salt-okunur ortamında dosya yazılamadı:", error.message);
  }
}

export function getUsers() {
  return readDb().users;
}

export function getUserById(id) {
  return readDb().users.find((u) => u.id === id) || null;
}

export function getUserByEmail(email) {
  return (
    readDb().users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    ) || null
  );
}

export function getUserBySlug(slug) {
  return readDb().users.find((u) => u.slug === slug) || null;
}

export function createUser(userData) {
  const db = readDb();
  db.users.push(userData);
  writeDb(db);
  return userData;
}

export function updateUser(id, patch) {
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...patch };
  writeDb(db);
  return db.users[idx];
}

export function deleteUser(id) {
  const db = readDb();
  db.users = db.users.filter((u) => u.id !== id);
  writeDb(db);
}

export function slugExists(slug, excludeId) {
  return readDb().users.some((u) => u.slug === slug && u.id !== excludeId);
}

export function emailExists(email, excludeId) {
  return readDb().users.some(
    (u) =>
      u.email.toLowerCase() === String(email).toLowerCase() &&
      u.id !== excludeId
  );
}
