import React from 'react';
import { Download } from 'lucide-react';

interface ExpenseCardProps {
  title: string;
  amount: string;
  type: 'total' | 'month' | 'export';
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function ExpenseCard({ title, amount, type, icon, onClick }: ExpenseCardProps) {
  const getCardStyles = () => {
    switch (type) {
      case 'total':
        return 'bg-gradient-to-br from-red-500 to-red-600 text-white';
      case 'month':
        return 'bg-gradient-to-br from-orange-500 to-orange-600 text-white';
      case 'export':
        return 'bg-white text-gray-800 border border-gray-100';
      default:
        return 'bg-white text-gray-800';
    }
  };

  const isClickable = type === 'export';

  return (
    <div 
      className={`
        rounded-2xl p-6 shadow-sm  transition-all duration-300 
        ${getCardStyles()}
        ${isClickable ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-medium ${type === 'export' ? 'text-gray-600' : 'text-white/90'} mb-2`}>
            {title}
          </h3>
          {amount && (
            <p className={`text-3xl font-bold ${type === 'export' ? 'text-gray-800' : 'text-white'}`}>
              {amount}
            </p>
          )}
          {type === 'export' && (
            <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300">
              <Download size={18} />
              <span className="font-medium">Download PDF</span>
            </div>
          )}
        </div>
        <div className={`${type === 'export' ? 'text-gray-400' : 'text-white/70'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}