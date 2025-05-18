import React, { useState } from 'react';

function DealForm({ onAdd }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    onAdd({ name, amount, currency });
    setName('');
    setAmount('');
    setCurrency('USD');
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    RUB: '₽',
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        className="flex-1 p-2 border rounded"
        placeholder="Deal name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-24 p-2 border rounded text-right"
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        className="w-16 p-2 border rounded text-center text-sm"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        {Object.entries(currencySymbols).map(([code, symbol]) => (
          <option key={code} value={code}>
            {symbol}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
}

export default DealForm;
