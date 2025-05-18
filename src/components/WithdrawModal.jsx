import React from 'react';
import { X } from 'lucide-react';

const options = [
  { label: 'На карту UnionPay', icon: '🏦' },
  { label: 'На Alipay', icon: '🅰️' },
  { label: 'На WeChat', icon: '💬' },
  { label: 'На счёт фирмы', icon: '🏢' },
  { label: 'USDT', icon: '🪙' },
];

const WithdrawModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-4">Выберите способ вывода</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((opt) => (
            <div
              key={opt.label}
              className="flex items-center gap-3 p-3 border rounded shadow hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="text-2xl">{opt.icon}</div>
              <div className="font-medium text-sm sm:text-base break-words">
                {opt.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
