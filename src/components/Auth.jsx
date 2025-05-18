import { useState } from "react";

export default function Auth({ onLogin }) {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;
    localStorage.setItem("currentUserPhone", trimmed);
    onLogin(trimmed);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="tel"
          placeholder="+1234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
