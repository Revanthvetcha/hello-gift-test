import React from 'react';
import { format } from 'date-fns';
import { IndianRupee } from 'lucide-react';

export default function ExpensesPDF({ expenses, stores }) {
  const getStoreName = (storeId) => stores.find(s => s.id === storeId)?.store_name || "N/A";
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-8 bg-white font-sans">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>
      
      <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Expense Report</h1>
        <p className="text-slate-600">Generated on {format(new Date(), 'PPP')}</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Summary</h2>
          <div className="text-right">
            <p className="text-sm text-slate-500">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600 flex items-center justify-end">
              <IndianRupee className="w-6 h-6" />
              {totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex bg-slate-800 text-white font-semibold uppercase text-sm py-3 px-4 rounded-t-lg">
          <div className="flex-1">Date</div>
          <div className="flex-1">Store</div>
          <div className="flex-1">Expense</div>
          <div className="w-32">Category</div>
          <div className="w-32 text-right">Amount</div>
        </div>
        <div className="border-x border-b border-slate-200">
          {expenses.map((expense, index) => (
            <div key={index} className="flex py-3 px-4 border-b border-slate-100">
              <div className="flex-1">{format(new Date(expense.expense_date), 'MMM d, yyyy')}</div>
              <div className="flex-1">{getStoreName(expense.store_id)}</div>
              <div className="flex-1">{expense.expense_name}</div>
              <div className="w-32 capitalize">{expense.category.replace('_', ' ')}</div>
              <div className="w-32 text-right flex items-center justify-end">
                <IndianRupee className="w-3 h-3" />
                {expense.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-slate-500 text-sm border-t pt-4">
        <p>This is a computer-generated expense report.</p>
      </div>
    </div>
  );
}