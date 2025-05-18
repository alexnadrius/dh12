import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import TransferModal from './TransferModal';
import ProgressBar from './ProgressBar';

const API_URL = 'https://script.google.com/macros/s/AKfycbyUYsCBhtiWID9kP4t_MtO2cxsgGyqFszzSIcIiZqSfORD2xYstkyaTzQgBm6ZLxB8sjw/exec';

const Chat = ({ deals, updateDeal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const deal = Array.isArray(deals) ? deals.find((d) => d.id == id) : null;
  const currentUserPhone = localStorage.getItem('currentUserPhone');

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const bottomRef = useRef(null);

  // Загрузка сообщений при загрузке чата
  useEffect(() => {
    if (!deal) return;
    const loadMessages = async () => {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'getMessages', dealId: deal.id }),
      });
      const data = await res.json();
      setMessages(data);
    };
    loadMessages();
  }, [deal]);

  // Автоскролл вниз при новом сообщении
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const payload = {
      action: 'sendMessage',
      dealId: deal.id,
      sender: currentUserPhone,
      text: text.trim(),
    };

    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setMessages((prev) => [
      ...prev,
      {
        dealId: deal.id,
        sender: currentUserPhone,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setText('');
  };

  if (!deal) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Сделка не найдена</h2>
      </div>
    );
  }

  return (
    <div className="h-[100svh] flex flex-col bg-gray-50 overflow-visible">
      <div className="p-4 flex items-center gap-2 text-sm text-blue-600 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 hover:underline text-sm"
        >
          <ArrowLeft size={16} /> к сделкам
        </button>
      </div>

      <div className="px-4 pb-2 overflow-y-auto shrink-0 z-10 relative">
        <div className="bg-gray-100 rounded-lg p-3 shadow-sm space-y-3 text-sm">
          <h3 className="text-base font-bold">{deal.name}</h3>
          <div className="text-sm text-gray-600">{deal.amount} {deal.currency}</div>
          <ProgressBar
            stageIndex={deal.stageIndex}
            onStageChange={(index) => updateDeal({ ...deal, stageIndex: index })}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
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

      <div className="sticky bottom-0 bg-white border-t px-2 py-2 flex items-center gap-2 z-10">
        <button onClick={() => setShowTransfer(true)}>
          <Plus className="text-blue-500" />
        </button>
        <input
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
          onTransfer={() => {}} // пока не используем
          maxAmount={999999}
        />
      )}
    </div>
  );
};

export default Chat;
