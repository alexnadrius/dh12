import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const stages = [
  'Счёт выставлен',
  'Счёт оплачен',
  'Товар оплачен',
  'Товар получен',
  'Взаиморасчёт произведён',
];

const DealList = ({ deals, addDeal, deleteDeal, updateDeal, reorderDeals, currentUserPhone }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');
  const [editingNameId, setEditingNameId] = useState(null);
  const [editingAmountId, setEditingAmountId] = useState(null);
  const [editingCounterpartyId, setEditingCounterpartyId] = useState(null);
  const [counterpartyPhone, setCounterpartyPhone] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  const handleCreate = () => {
    if (!name.trim() || !amount.trim()) return;
    const newDeal = {
      id: Date.now(),
      name: name.trim(),
      amount: parseFloat(amount),
      currency,
      stageIndex: 0,
      messages: [],
      participants: [],
      transfer: 0,
      buyerPhone: '',
      supplierPhone: '',
      createdBy: currentUserPhone,
    };
    addDeal(newDeal);
    setName('');
    setAmount('');
    setCurrency('$');
    setFormVisible(false);
  };

  const updateDealSmart = (id, fieldsToUpdate) => {
    const deal = deals.find((d) => d.id === id);
    if (!deal) return;
    const updated = { ...deal, ...fieldsToUpdate };
    updateDeal(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(deals);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    reorderDeals(reordered);
  };

  const handleClickOutsideForm = (e) => {
    if (e.target.id === 'form-container') {
      setFormVisible(false);
    }
  };

  const visibleDeals = deals.filter(
    (d) =>
      d.createdBy === currentUserPhone ||
      d.buyerPhone === currentUserPhone ||
      d.supplierPhone === currentUserPhone
  );

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto" onClick={handleClickOutsideForm} id="form-container">
      <h2 className="text-xl font-bold mb-2">Список сделок</h2>

      {!formVisible ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setFormVisible(true);
          }}
          className="border rounded-md p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
        >
          <Plus size={24} className="text-blue-500" />
        </div>
      ) : (
        <div className="bg-white border rounded p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="w-full border rounded p-2 text-sm"
              placeholder="Название сделки"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                className="w-24 border rounded p-2 text-sm"
                placeholder="Сумма"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select
                className="border rounded p-2 text-sm"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="$">$</option>
                <option value="¥">¥</option>
              </select>
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
                onClick={handleCreate}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="deal-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {visibleDeals.map((deal, index) => {
                const isBuyer = deal.buyerPhone === currentUserPhone;
                const counterparty = isBuyer ? deal.supplierPhone : deal.buyerPhone;
                const counterpartyField = isBuyer ? 'supplierPhone' : 'buyerPhone';

                return (
                  <Draggable key={deal.id} draggableId={deal.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => navigate(`/deal/${deal.id}`)}
                        className="relative block bg-white rounded shadow p-4 space-y-2 hover:shadow-md transition cursor-pointer mb-2"
                      >
                        <div className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDeal(deal.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center flex-wrap gap-2">
                          {editingNameId === deal.id ? (
                            <input
                              className="border rounded px-1 text-sm"
                              value={deal.name}
                              onChange={(e) => updateDealSmart(deal.id, { name: e.target.value })}
                              onBlur={() => setEditingNameId(null)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          ) : (
                            <h3
                              className="font-semibold text-base"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingNameId(deal.id);
                              }}
                            >
                              {deal.name || 'Без названия'}
                            </h3>
                          )}

                          {editingAmountId === deal.id ? (
                            <input
                              className="border rounded px-1 w-24 text-sm"
                              value={deal.amount}
                              onChange={(e) => updateDealSmart(deal.id, { amount: parseFloat(e.target.value) || 0 })}
                              onBlur={() => setEditingAmountId(null)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="text-sm text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAmountId(deal.id);
                              }}
                            >
                              {deal.amount} {deal.currency}
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span>Контрагент:</span>
                          {editingCounterpartyId === deal.id ? (
                            <input
                              className="border rounded px-1 text-sm"
                              value={counterpartyPhone}
                              onChange={(e) => setCounterpartyPhone(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateDealSmart(deal.id, {
                                    [counterpartyField]: counterpartyPhone.trim(),
                                  });
                                  setEditingCounterpartyId(null);
                                }
                              }}
                              onBlur={() => {
                                updateDealSmart(deal.id, {
                                  [counterpartyField]: counterpartyPhone.trim(),
                                });
                                setEditingCounterpartyId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                          ) : (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCounterpartyId(deal.id);
                                setCounterpartyPhone(counterparty || '');
                              }}
                            >
                              {counterparty || 'добавить'}
                            </button>
                          )}
                        </div>

                        <div className="text-sm text-gray-500">
                          {stages[deal.stageIndex] || 'не указан'}
                        </div>
                        <ProgressBar stageIndex={deal.stageIndex} readonly />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DealList;
