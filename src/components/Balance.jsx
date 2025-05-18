import React, { useState } from 'react';
import RechargeModal from './RechargeModal';
import WithdrawModal from './WithdrawModal';

const exchangeRates = {
  '$': 1,
  '¥': 1 / 7
};

const Balance = ({ deals, role, setDeals }) => {
  const [showRecharge, setShowRecharge] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const toUE = (deal) =>
    Number(deal.amount) * (exchangeRates[deal.currency] || 1);

  const completed = deals.filter((d) => d.stageIndex === 4);
  const totalCompleted = completed.reduce((sum, d) => sum + toUE(d), 0);

  const totalTransferred = deals.reduce(
    (sum, d) => sum + (d.transfer || 0),
    0
  );

  const balance =
    role === 'supplier'
      ? totalTransferred
      : totalCompleted - totalTransferred;

  const simulateAdd = (amount, currency) => {
    const newDeal = {
      id: Date.now(),
      name: 'Пополнение (тест)',
      amount,
      currency,
      stageIndex: 4,
      messages: [],
      transfer: 0
    };
    const updated = [...deals, newDeal];
    setDeals(updated);
    localStorage.setItem('deals', JSON.stringify(updated));
  };

  return (
    <>
      <div className="bg-white px-4 pt-4 pb-2 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="text-lg font-semibold">Баланс</div>
          <div className="text-3xl font-bold">
            {balance.toFixed(2)}{' '}
            <span className="text-base font-normal text-gray-500">У.Е.</span>
          </div>
        </div>

        {role === 'supplier' && (
          <button
            onClick={() => setShowWithdraw(true)}
            className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            💸 Вывести
          </button>
        )}

        {role === 'buyer' && (
          <button
            onClick={() => setShowRecharge(true)}
            className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            💰 Пополнить
          </button>
        )}
      </div>

      {showRecharge && (
        <RechargeModal
          onClose={() => setShowRecharge(false)}
          onSimulateAdd={simulateAdd}
        />
      )}

      {showWithdraw && (
        <WithdrawModal onClose={() => setShowWithdraw(false)} />
      )}
    </>
  );
};

export default Balance;