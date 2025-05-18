import React, { useState } from 'react';
import { X } from 'lucide-react';

const methods = [
  {
    id: 'cash',
    name: 'Наличные (Москва)',
    description: '±1,5% от 500к',
    fee: 0.015,
  },
  {
    id: 'card',
    name: 'Банковская карта',
    description: '±2,5%',
    fee: 0.025,
  },
  {
    id: 'usdt',
    name: 'USDT',
    description: '1/1 USD',
    fee: 0,
  },
  {
    id: 'bank',
    name: 'Безналичный расчёт',
    description: '8–11%',
    fee: 0.095,
  },
];

const RechargeModal = ({ onClose, onSimulateAdd }) => {
  const [selected, setSelected] = useState('card');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');

  const handleConfirm = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert('Введите сумму');
      return;
    }

    const fee = methods.find((m) => m.id === selected)?.fee || 0;
    const final = value * (1 - fee);

    onSimulateAdd(final, currency);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold mb-4">Пополнение баланса</h3>

        <div className="space-y-3 mb-4">
          {methods.map((method) => (
            <label
              key={method.id}
              className={`block border rounded p-3 cursor-pointer ${
                selected === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="method"
                value={method.id}
                checked={selected === method.id}
                onChange={() => setSelected(method.id)}
                className="mr-2"
              />
              <span className="font-semibold">{method.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                {method.description}
              </span>
            </label>
          ))}
        </div>

        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium">Сумма</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
            className="w-full border rounded p-2"
          />

          <label className="block text-sm font-medium mt-2">Валюта</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="$">USD ($)</option>
            <option value="¥">CNY (¥)</option>
          </select>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Пополнить (тест)
        </button>
      </div>
    </div>
  );
};

export default RechargeModal;
