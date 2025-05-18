import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const stages = [
  'Счёт выставлен',
  'Счёт оплачен',
  'Товар оплачен',
  'Товар получен',
  'Взаиморасчёт произведён',
];

const colors = ['red', 'orange', 'yellow', 'green', 'blue'];

const ProgressBar = ({ stageIndex = 0, onStageChange, readonly }) => {
  const [open, setOpen] = useState(false);
  const percentage = (stageIndex / (stages.length - 1)) * 100;
  const color = colors[stageIndex] || 'gray';

  return (
    <div className="relative">
      <div
        className={`h-2 rounded-full bg-gray-200 overflow-hidden ${readonly ? '' : 'cursor-pointer'}`}
        onClick={() => {
          if (!readonly) setOpen(!open);
        }}
      >
        <div
          className={`h-full transition-all`}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>

      {/* Выпадающий список этапов */}
      {open && !readonly && (
        <div className="absolute z-10 mt-1 bg-white border rounded shadow w-full text-sm">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`px-3 py-2 hover:bg-gray-100 ${
                index === stageIndex ? 'font-semibold text-blue-600' : ''
              }`}
              onClick={() => {
                onStageChange(index);
                setOpen(false);
              }}
            >
              {stage}
            </div>
          ))}
        </div>
      )}

      {/* Стрелочка только если редактируемо */}
      {!readonly && (
        <div
          className="absolute top-0 right-0 transform translate-y-[-50%] -mt-1"
          onClick={() => setOpen(!open)}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
