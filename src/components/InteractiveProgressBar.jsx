import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const stages = [
  'Счёт выставлен',
  'Счёт оплачен',
  'Товар отправлен',
  'Товар получен',
  'Взаиморасчёт произведён'
];

const getColor = (index) => {
  if (index < 1) return 'bg-red-500';
  if (index < 3) return 'bg-yellow-500';
  return 'bg-green-500';
};

const InteractiveProgressBar = ({ stageIndex, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const percentage = ((stageIndex + 1) / stages.length) * 100;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-1 text-sm text-gray-700">
          <span>{stages[stageIndex]}</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className={`h-full rounded ${getColor(stageIndex)} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow text-sm">
          {stages.map((label, i) => (
            <div
              key={i}
              onClick={() => {
                onChange(i);
                setIsOpen(false);
              }}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${
                i === stageIndex ? 'font-semibold text-blue-600' : ''
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveProgressBar;
