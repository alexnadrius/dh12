import React, { useState } from 'react';
import { X } from 'lucide-react';

const InviteModal = ({ onClose, onInvite, role }) => {
  const [phone, setPhone] = useState('');

  const handleConfirm = () => {
    if (!phone.trim()) return alert('Введите номер');
    onInvite(phone.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-4">Пригласить {role === 'buyer' ? 'поставщика' : 'покупателя'}</h2>

        <label className="block text-sm font-medium mb-1">Номер телефона:</label>
        <input
          type="tel"
          className="border p-2 rounded w-full mb-4"
          placeholder="+79991112233"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Пригласить
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
