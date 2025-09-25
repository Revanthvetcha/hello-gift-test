import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Pencil, Download, Receipt, Calendar } from "lucide-react";
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ExpensesPDF from './ExpensesPDF';

const categoryColors = {
  rent: "bg-blue-100 text-blue-800",
  utilities: "bg-green-100 text-green-800", 
  supplies: "bg-yellow-100 text-yellow-800",
  marketing: "bg-purple-100 text-purple-800",
  maintenance: "bg-orange-100 text-orange-800",
  salaries: "bg-pink-100 text-pink-800",
  inventory: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800"
};

export default function ExpenseList({ expenses, stores, isLoading, onEdit }) {
  const [expensesToPrint, setExpensesToPrint] = useState(null);

  const getStoreName = (storeId) => stores.find(s => s.id === storeId)?.store_name || "N/A";

  const handleDownloadExpenses = () => {
    setExpensesToPrint(expenses);
    setTimeout(() => {
      window.print();
      setExpensesToPrint(null);
    }, 100);
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthlyExpenses = expenses
    .filter(expense => expense.expense_date.startsWith(currentMonth))
    .reduce((sum, expense) => sum + expense.amount, 0);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse bg-slate-200 h-64 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="print:hidden">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Total Expenses</p>
                  <p className="text-2xl font-bold flex items-center">
                    <IndianRupee className="w-5 h-5" />
                    {totalExpenses.toLocaleString('en-IN')}
                  </p>
                </div>
                <Receipt className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">This Month</p>
                  <p className="text-2xl font-bold flex items-center">
                    <IndianRupee className="w-5 h-5" />
                    {monthlyExpenses.toLocaleString('en-IN')}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600">Export Data</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={handleDownloadExpenses}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses List */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-600" />
              Expense Records ({expenses.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          {expense.category.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-900 mb-1">
                            {expense.expense_name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge className={categoryColors[expense.category]}>
                              {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                            </Badge>
                            <Badge variant="outline">
                              {getStoreName(expense.store_id)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            {format(new Date(expense.expense_date), 'MMM d, yyyy')}
                          </p>
                          {expense.notes && (
                            <p className="text-sm text-slate-600 mt-1">{expense.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600 flex items-center">
                          <IndianRupee className="w-5 h-5" />
                          {expense.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(expense)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {expenses.length === 0 && (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No expenses recorded</h3>
                  <p className="text-slate-500">Start tracking your business expenses</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden PDF Component */}
      {expensesToPrint && (
        <div className="hidden print:block">
          <ExpensesPDF expenses={expensesToPrint} stores={stores} />
        </div>
      )}
    </>
  );
}