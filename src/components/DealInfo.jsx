// src/components/Chat/DealInfo.jsx
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import ProgressBar from './ProgressBar';

const DealInfo = ({ deal, role, updateDeal }) => {
  const [editName, setEditName] = useState(false);
  const [editAmount, setEditAmount] = useState(false);
  const [inviteMode, setInviteMode] = useState(false);
  const [phone, setPhone] = useState('');

  const isBuyer = role === 'buyer';
  const otherRole = isBuyer ? 'Поставщик' : 'Покупатель';
  const otherPhone = isBuyer ? deal.supplierPhone : deal.buyerPhone;
  const inviteUrl = `${window.location.origin}/deal/${deal.id}`;
  const field = isBuyer ? 'supplierPhone' : 'buyerPhone';

  const handleInvite = () => {
    if (!phone.trim()) return;
    updateDeal({ ...deal, [field]: phone.trim() });
    setInviteMode(false);
    setPhone('');
  };

  return (
    <div className="bg-gray-100 rounded-lg p-3 shadow-sm space-y-3 text-sm">
      {/* Название + бюджет */}
      <div className="flex justify-between items-center">
        {editName ? (
          <input
            value={deal.name}
            onChange={(e) => updateDeal({ ...deal, name: e.target.value })}
            onBlur={() => setEditName(false)}
            autoFocus
            className="text-base font-bold bg-white rounded px-2 py-1 w-full"
          />
        ) : (
          <h3
            className="text-base font-bold cursor-pointer"
            onClick={() => setEditName(true)}
          >
            {deal.name || 'Без названия'}
          </h3>
        )}

        <div className="text-right">
          {editAmount ? (
            <input
              type="number"
              value={deal.amount}
              onChange={(e) => updateDeal({ ...deal, amount: e.target.value })}
              onBlur={() => setEditAmount(false)}
              autoFocus
              className="w-20 bg-white rounded px-1"
            />
          ) : (
            <span
              className="cursor-pointer underline-offset-2"
              onClick={() => setEditAmount(true)}
            >
              {deal.amount} {deal.currency} ({Number(deal.amount).toFixed(2)} У.Е.)
            </span>
          )}
        </div>
      </div>

      {/* Участник + кнопка */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 flex items-center gap-2">
          {otherRole}:{' '}
          <button
            onClick={() => setInviteMode(true)}
            className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
          >
            <UserPlus size={14} />
            {otherPhone || 'пригласить участника'}
          </button>
        </span>
      </div>

      {inviteMode && (
        <div className="mt-2 space-y-1">
          <input
            type="tel"
            placeholder="Телефон участника"
            className="w-full border rounded px-2 py-1 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Ссылка: {inviteUrl}</span>
            <button
              onClick={handleInvite}
              className="text-white bg-blue-500 px-3 py-1 rounded text-xs"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="text-sm font-medium text-gray-700">
        Статус:{' '}
        {deal.stageIndex != null
          ? ['Счёт выставлен', 'Счёт оплачен', 'Товар оплачен', 'Товар получен', 'Взаиморасчёт произведён'][deal.stageIndex]
          : 'не указан'}
      </div>

      <ProgressBar
        stageIndex={deal.stageIndex}
        onStageChange={(index) => updateDeal({ ...deal, stageIndex: index })}
      />
    </div>
  );
};

export default DealInfo;
