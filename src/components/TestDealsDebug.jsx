// Тестовая кнопка для проверки записи supplierPhone
import React, { useState } from 'react';

const TestDealsDebug = () => {
  const [deals, setDeals] = useState([]);

  const createTestDeal = () => {
    const newDeal = {
      id: Date.now(),
      name: 'Тест',
      amount: 100,
      currency: '$',
      stageIndex: 0,
      messages: [],
      participants: [],
      transfer: 0,
      buyerPhone: '',
      supplierPhone: '9999999999',
      createdBy: '9999999999'
    };
    const updated = [...deals, newDeal];
    setDeals(updated);
    localStorage.setItem('deals', JSON.stringify(updated));
    console.log('💾 Сохранили в localStorage:', JSON.stringify(updated, null, 2));
  };

  return (
    <div className="p-4">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={createTestDeal}
      >
        Создать тестовую сделку с supplierPhone
      </button>
    </div>
  );
};

export default TestDealsDebug;
