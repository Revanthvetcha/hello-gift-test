import React, { useState, useEffect } from 'react';
import { Expense, Store } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExpenseForm from '../components/expenses/ExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [expensesData, storesData] = await Promise.all([
        Expense.list(),
        Store.list()
      ]);
      setExpenses(expensesData);
      setStores(storesData);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
    setIsLoading(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleFormSuccess = () => {
    loadData();
    handleFormClose();
  };
  
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };
  
  const handleAddNew = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-slate-600 mt-1">Monitor and manage all your business expenses</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Expense
            </Button>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {showForm && (
            <ExpenseForm
              expense={editingExpense}
              stores={stores}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
        </AnimatePresence>

        <ExpenseList
          expenses={expenses}
          stores={stores}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}