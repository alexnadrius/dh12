import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SiTelegram, SiWechat } from 'react-icons/si';

const Footer = ({ role }) => {
  const icon =
    role === 'supplier' ? (
      <SiWechat className="text-green-600" size={18} />
    ) : (
      <SiTelegram className="text-blue-500" size={18} />
    );

  return (
    <footer className="bg-gray-100 text-gray-600 px-4 text-sm border-t w-full flex justify-center items-center h-[48px]">
      <div className="flex items-center gap-2">
        <span className="text-gray-800 font-medium">🛠 Техподдержка</span>
        <ArrowRight size={14} className="text-gray-400" />
        {icon}
      </div>
    </footer>
  );
};

export default Footer;
