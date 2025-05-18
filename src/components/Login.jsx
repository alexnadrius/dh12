import React, { useState } from 'react';
import { API_URL } from '../config'; 


const Login = ({ setCurrentUser, onLoginSuccess }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) return;

    setLoading(true);
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'auth', phone }),
    });
    const user = await res.json();
    localStorage.setItem('currentUserPhone', user.phone);
    setCurrentUser(user);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-center">Вход по телефону</h2>
        <input
          type="text"
          placeholder="Введите номер"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
      </div>
    </div>
  );
};

export default Login;
