"use client";

import { deleteUserAction } from "../../actions";

export default function DeleteUserForm({ userId, userName }) {
  function handleSubmit(e) {
    const confirmed = window.confirm(
      `${userName || "Bu kullanıcıyı"} silmek istediğine emin misin? Bu işlem geri alınamaz, kartvizit verileri kalıcı olarak silinir.`
    );
    if (!confirmed) {
      e.preventDefault();
    }
  }

  return (
    <form
      action={deleteUserAction}
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl2 border border-red-200 bg-red-50 p-4"
    >
      <input type="hidden" name="id" value={userId} />
      <p className="mb-2 text-xs text-red-700">
        Bu hesabı ve kartvizitini kalıcı olarak siler.
      </p>
      <button className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
        Kullanıcıyı Sil
      </button>
    </form>
  );
}
