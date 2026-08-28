import initialData from "../data/db.json";

function readDb() {
  return initialData || { users: [], cards: [] };
}

function writeDb(db) {
  // Vercel serverless ortamında veriler diske yazılamaz
  console.warn("Vercel ortamında salt-okunur mod çalısıyor.");
}

// 1. Kullanıcı Listeleme ve Alma
export function getUsers() {
  return readDb().users || [];
}

export function getUserById(id) {
  return readDb().users?.find((u) => String(u.id) === String(id)) || null;
}

export function getUserByEmail(email) {
  return readDb().users?.find((u) => u.email?.toLowerCase() === email?.toLowerCase()) || null;
}

export function getUserBySlug(slug) {
  return readDb().users?.find((u) => u.slug === slug || u.cardData?.slug === slug) || null;
}

// 2. Kontrol Fonksiyonları
export function slugExists(slug, currentUserId = null) {
  const users = getUsers();
  return users.some(
    (u) => (u.slug === slug || u.cardData?.slug === slug) && String(u.id) !== String(currentUserId)
  );
}

export function emailExists(email, currentUserId = null) {
  const users = getUsers();
  return users.some(
    (u) => u.email?.toLowerCase() === email?.toLowerCase() && String(u.id) !== String(currentUserId)
  );
}

// 3. Kullanıcı Oluşturma, Güncelleme ve Silme
export function createUser(userData) {
  const db = readDb();
  const newUser = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    ...userData,
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function updateUser(id, updateData) {
  const db = readDb();
  const index = db.users.findIndex((u) => String(u.id) === String(id));
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...updateData };
    writeDb(db);
    return db.users[index];
  }
  return null;
}

export function deleteUser(id) {
  const db = readDb();
  const index = db.users.findIndex((u) => String(u.id) === String(id));
  if (index !== -1) {
    const deleted = db.users.splice(index, 1);
    writeDb(db);
    return deleted[0];
  }
  return null;
}