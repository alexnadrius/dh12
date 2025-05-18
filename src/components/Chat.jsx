import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserPlus } from 'lucide-react';
import TransferModal from './TransferModal';
import ProgressBar from './ProgressBar';

const Chat = ({ deals, updateDeal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const deal = Array.isArray(deals) ? deals.find((d) => d.id === Number(id)) : null;
  const currentUserPhone = localStorage.getItem('currentUserPhone');

  const [text, setText] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editAmount, setEditAmount] = useState(false);
  const [inviteMode, setInviteMode] = useState(false);
  const [phone, setPhone] = useState('');

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (
      deal &&
      currentUserPhone !== deal.createdBy &&
      currentUserPhone !== deal.buyerPhone &&
      currentUserPhone !== deal.supplierPhone
    ) {
      navigate('/');
    }
  }, [deal, currentUserPhone]);

  useEffect(() => {
    if (deal && !deal.messages) {
      updateDeal({ ...deal, messages: [] });
    }
  }, [deal]);

  // Автоскролл только при новых сообщениях
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [deal?.messages?.length]);



  if (!deal) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Сделка не найдена</h2>
      </div>
    );
  }

  const sendMessage = () => {
    if (!text.trim()) return;
    const updated = {
      ...deal,
      messages: [
        ...(deal.messages || []),
        {
          id: Date.now(),
          text: text.trim(),
          sender: currentUserPhone,
        },
      ],
    };
    updateDeal(updated);
    setText('');
  };

  const handleTransfer = (amount) => {
    const updated = {
      ...deal,
      transfer: (deal.transfer || 0) + amount,
      messages: [
        ...(deal.messages || []),
        {
          id: Date.now(),
          text: `💸 Переведено ${amount.toFixed(2)} У.Е.`,
          sender: currentUserPhone,
        },
      ],
    };
    updateDeal(updated);
  };

  const handleInvite = () => {
    if (!phone.trim()) return;
    const isBuyer = deal.buyerPhone === currentUserPhone;
    const field = isBuyer ? 'supplierPhone' : 'buyerPhone';
    updateDeal({ ...deal, [field]: phone.trim() });
    setInviteMode(false);
    setPhone('');
  };

  const isBuyer = deal.buyerPhone === currentUserPhone;
  const otherRole = isBuyer ? 'Поставщик' : 'Покупатель';
  const otherPhone = isBuyer ? deal.supplierPhone : deal.buyerPhone;
  const inviteUrl = `${window.location.origin}/deal/${deal.id}`;

  return (
    <div className="h-[100svh] flex flex-col bg-gray-50 overflow-visible">
      {/* Навигация */}
      <div className="p-4 flex items-center gap-2 text-sm text-blue-600 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 hover:underline text-sm"
        >
          <ArrowLeft size={16} /> к сделкам
        </button>
      </div>

      {/* Информация о сделке */}
      <div className="px-4 pb-2 overflow-y-auto shrink-0 z-10 relative">
        <div className="bg-gray-100 rounded-lg p-3 shadow-sm space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
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
                  className="w-24 bg-white rounded px-1"
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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2">
                <span className="text-gray-500 break-all">Ссылка: {inviteUrl}</span>
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
              ? [
                  'Счёт выставлен',
                  'Счёт оплачен',
                  'Товар оплачен',
                  'Товар получен',
                  'Взаиморасчёт произведён',
                ][deal.stageIndex]
              : 'не указан'}
          </div>

          <ProgressBar
            stageIndex={deal.stageIndex}
            onStageChange={(index) => updateDeal({ ...deal, stageIndex: index })}
          />
        </div>
      </div>

      {/* Чат */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {(deal.messages || []).map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] px-3 py-2 rounded text-sm break-words ${
              msg.sender === currentUserPhone
                ? 'bg-blue-100 text-right ml-auto'
                : 'bg-gray-200 text-left'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Инпут */}
      <div className="sticky bottom-0 bg-white border-t px-2 py-2 flex items-center gap-2 z-10">
        <button onClick={() => setShowTransfer(true)}>
          <Plus className="text-blue-500" />
        </button>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
          className="flex-1 border rounded px-3 py-2 text-[16px]"
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className={`px-4 py-2 rounded transition-all duration-200 ${
            text.trim()
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-white cursor-not-allowed'
          }`}
        >
          Отправить
        </button>
      </div>

      {showTransfer && (
        <TransferModal
          onClose={() => setShowTransfer(false)}
          onTransfer={handleTransfer}
          maxAmount={999999}
        />
      )}
    </div>
  );
};

export default Chat;
