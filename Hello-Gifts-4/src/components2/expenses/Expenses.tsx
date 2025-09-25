import  { useState } from 'react';
import { DollarSign, Calendar, FileText, Plus } from 'lucide-react';
import ExpenseCard from './ExpenseCard';
import ExpenseRecord from './ExpenseRecord';
import AddExpenseModal from "./AddExpenseModal";
import { generateExpensePDF, ExpenseData } from './PdfGenerator';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);
  const [expenses, setExpenses] = useState<ExpenseData[]>([
    {
      id: '1',
      name: 'Rent',
      category: 'Rent',
      store: 'Tech Hub Gurgaon',
      amount: 0,
      date: '2025-08-27'
    },
    {
      id: '2',
      name: 'Electricity',
      category: 'Utilities',
      store: 'Downtown Electronics',
      amount: 3499,
      date: '2025-08-01'
    }
  ]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = (newExpense: ExpenseData) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(expenses.map(expense => 
        expense.id === editingExpense.id ? newExpense : expense
      ));
      setEditingExpense(null);
    } else {
      // Add new expense
      setExpenses([...expenses, newExpense]);
    }
  };

  const handleEditExpense = (id: string) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    if (expenseToEdit) {
      setEditingExpense(expenseToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleDownloadPDF = () => {
    generateExpensePDF(expenses);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Rent': '#ef4444',
      'Utilities': '#10b981',
      'Food': '#f59e0b',
      'Transport': '#3b82f6',
      'Entertainment': '#8b5cf6',
      'Other': '#6b7280'
    };
    return colors[category] || colors['Other'];
  };

  const getAvatarLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen"  style={{
    backgroundColor: '#EFF6FF',
    overflowY: 'auto',
    width: '100%',
  }}>
      <div className="container mx-auto px-6 py-8 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
            <p className="text-gray-600 text-lg">Monitor and manage all your business expenses</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-transparent hover:border-red-300"
          >
            <Plus size={20} />
            Add New Expense
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ExpenseCard
            title="Total Expenses"
            amount={`₹ ${totalExpenses.toLocaleString()}`}
            type="total"
            icon={<DollarSign size={48} />}
          />
          <ExpenseCard
            title="This Month"
            amount={`₹ ${monthlyExpenses.toLocaleString()}`}
            type="month"
            icon={<Calendar size={48} />}
          />
          <ExpenseCard
            title="Export Data"
            amount=""
            type="export"
            icon={<FileText size={48} />}
            onClick={handleDownloadPDF}
          />
        </div>

        {/* Expense Records */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <DollarSign size={14} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Expense Records ({expenses.length} entries)
            </h2>
          </div>

          <div className="space-y-4">
            {expenses.map((expense) => (
              <ExpenseRecord
                key={expense.id}
                id={expense.id}
                name={expense.name}
                category={expense.category}
                store={expense.store}
                amount={expense.amount}
                date={new Date(expense.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
                avatar={getAvatarLetter(expense.name)}
                categoryColor={getCategoryColor(expense.category)}
                onEdit={handleEditExpense}
              />
            ))}

            {expenses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No expenses recorded yet</p>
                <p>Click "Add New Expense" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddExpense}
        editingExpense={editingExpense}
      />
    </div>
  );
}

export default App;