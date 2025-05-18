import React, { useState } from 'react';
import { X } from 'lucide-react';

const TransferModal = ({ onClose, onTransfer, maxAmount }) => {
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert('Введите корректную сумму');
      return;
    }
    if (value > maxAmount) {
      alert('Недостаточно средств');
      return;
    }
    onTransfer(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold mb-4">Перевод средств</h3>
        <p className="text-sm mb-2 text-gray-600">
          У вас доступно: <strong>{maxAmount.toFixed(2)} У.Е.</strong>
        </p>
        <input
          type="number"
          className="w-full border rounded p-2 mb-4"
          placeholder="Сумма в У.Е."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleTransfer}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Перевести
        </button>
      </div>
    </div>
  );
};

export default TransferModal;
