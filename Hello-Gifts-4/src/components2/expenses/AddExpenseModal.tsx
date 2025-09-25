import React, { useState } from 'react';
import { X, Save, Calendar, ChevronDown } from 'lucide-react';

interface ExpenseData {
  id: string;
  name: string;
  category: string;
  store: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  notes?: string;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseData) => void;
  editingExpense?: ExpenseData | null;
}

export default function AddExpenseModal({ isOpen, onClose, onSave, editingExpense }: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    store: '',
    date: new Date().toISOString().split('T')[0],
    name: '',
    category: 'Other',
    amount: '',
    receiptUrl: '',
    notes: ''
  });

  React.useEffect(() => {
    if (editingExpense) {
      setFormData({
        store: editingExpense.store,
        date: editingExpense.date,
        name: editingExpense.name,
        category: editingExpense.category,
        amount: editingExpense.amount.toString(),
        receiptUrl: editingExpense.receiptUrl || '',
        notes: editingExpense.notes || ''
      });
    } else {
      setFormData({
        store: '',
        date: new Date().toISOString().split('T')[0],
        name: '',
        category: 'Other',
        amount: '',
        receiptUrl: '',
        notes: ''
      });
    }
  }, [editingExpense, isOpen]);

  const categories = ['Rent', 'Utilities', 'Food', 'Transport', 'Entertainment', 'Other'];
  const stores = ['Tech Hub Gurgaon', 'Downtown Electronics', 'Central Mall', 'Local Store', 'Online'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: editingExpense?.id || Date.now().toString(),
      amount: parseFloat(formData.amount) || 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Store</label>
                <div className="relative">
                  <select
                    value={formData.store}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Select a store</option>
                    {stores.map(store => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Expense Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Expense Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter expense description"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Receipt URL (Optional)</label>
              <input
                type="url"
                value={formData.receiptUrl}
                onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                placeholder="https://example.com/receipt.pdf"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this expense"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save size={18} />
                {editingExpense ? 'Update Expense' : 'Save Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}