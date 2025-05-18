import React from 'react';
import { useNavigate } from 'react-router-dom';

const options = [
  { label: 'Карта банка', icon: '💳' },
  { label: 'Наличные', icon: '💵' },
  { label: 'Перевод Б/Н', icon: '🏦' },
  { label: 'USDT', icon: '🪙' }
];

const Recharge = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <button
        onClick={() => navigate('/')}
        className="text-blue-500 underline mb-4"
      >
        ← Назад
      </button>

      <h2 className="text-xl font-bold mb-4">Пополнение баланса</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <div
            key={opt.label}
            className="flex items-center gap-3 p-4 border rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="text-2xl">{opt.icon}</div>
            <div className="text-base font-medium">{opt.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recharge;
