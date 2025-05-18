import React, { useState } from 'react';
import { Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ currentUserPhone, setCurrentUserPhone }) => {
  const [inputVisible, setInputVisible] = useState(!currentUserPhone);
  const [phoneInput, setPhoneInput] = useState('');

  const handleLogin = () => {
    const trimmed = phoneInput.trim();
    if (trimmed) {
      setCurrentUserPhone(trimmed);
      localStorage.setItem('currentUserPhone', trimmed);
      setInputVisible(false);
    }
  };

  const handleLogout = () => {
    setCurrentUserPhone('');
    localStorage.removeItem('currentUserPhone');
    setInputVisible(true);
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center gap-2 text-white text-lg font-semibold hover:opacity-90"
      >
        <Handshake size={24} />
        DealHub
      </Link>

      <div className="flex items-center gap-3">
        {inputVisible ? (
          <>
            <input
              type="tel"
              placeholder="Введите номер"
              className="px-2 py-1 rounded text-sm text-black"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            <button
              className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-semibold"
              onClick={handleLogin}
            >
              Войти
            </button>
          </>
        ) : (
          <>
            <span className="text-white text-sm">
              Вы вошли как: <strong>{currentUserPhone}</strong>
            </span>
            <button
              className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-semibold"
              onClick={handleLogout}
            >
              Сменить
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
