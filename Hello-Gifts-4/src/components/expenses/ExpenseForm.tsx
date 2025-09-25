import React, { useState } from 'react';
import { Expense } from '@/entities/Expense';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Save } from "lucide-react";
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const expenseCategories = [
  'rent', 'utilities', 'supplies', 'marketing', 'maintenance', 
  'salaries', 'inventory', 'other'
];

export default function ExpenseForm({ expense, stores, onClose, onSuccess }) {
  const [formData, setFormData] = useState(expense || {
    store_id: '',
    expense_name: '',
    category: 'other',
    amount: 0,
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    receipt_url: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        amount: parseFloat(formData.amount) || 0
      };
      
      if (expense) {
        await Expense.update(expense.id, dataToSave);
      } else {
        await Expense.create(dataToSave);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_id">Store</Label>
                  <Select value={formData.store_id} onValueChange={(val) => handleInputChange('store_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.store_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense_date">Expense Date</Label>
                  <Input 
                    id="expense_date" 
                    type="date" 
                    value={formData.expense_date} 
                    onChange={(e) => handleInputChange('expense_date', e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense_name">Expense Name</Label>
                <Input 
                  id="expense_name" 
                  value={formData.expense_name} 
                  onChange={(e) => handleInputChange('expense_name', e.target.value)} 
                  placeholder="Enter expense description"
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(val) => handleInputChange('category', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.01"
                    value={formData.amount} 
                    onChange={(e) => handleInputChange('amount', e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt_url">Receipt URL (Optional)</Label>
                <Input 
                  id="receipt_url" 
                  value={formData.receipt_url} 
                  onChange={(e) => handleInputChange('receipt_url', e.target.value)} 
                  placeholder="https://example.com/receipt.pdf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  value={formData.notes} 
                  onChange={(e) => handleInputChange('notes', e.target.value)} 
                  placeholder="Additional notes about this expense"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-red-500 to-red-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Expense'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}