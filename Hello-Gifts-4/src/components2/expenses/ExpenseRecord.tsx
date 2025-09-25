
import { Edit2 } from 'lucide-react';

interface ExpenseRecordProps {
  id: string;
  name: string;
  category: string;
  store: string;
  amount: number;
  date: string;
  avatar: string;
  categoryColor: string;
  onEdit: (id: string) => void;
}

export default function ExpenseRecord({ 
  id,
  name, 
  category, 
  store, 
  amount, 
  date, 
  avatar, 
  categoryColor,
  onEdit
}: ExpenseRecordProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: categoryColor }}
          >
            {avatar}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-1">{name}</h4>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {category}
              </span>
              <span className="text-gray-600 font-medium">{store}</span>
            </div>
            <p className="text-gray-500 text-sm">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-red-500">₹ {amount.toLocaleString()}</span>
          <button 
            onClick={() => onEdit(id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Edit2 size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}