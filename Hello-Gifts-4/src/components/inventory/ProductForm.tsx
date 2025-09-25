import React, { useState } from 'react';
import { Product } from '@/entities/Product';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { motion } from 'framer-motion';

export default function ProductForm({ product, stores, onClose, onSuccess }) {
  const [formData, setFormData] = useState(product || {
    store_id: '',
    product_name: '',
    product_code: '',
    category: '',
    unit_price: 0,
    stock_quantity: 0,
    min_stock_level: 10,
    unit: 'piece'
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
        unit_price: parseFloat(formData.unit_price) || 0,
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
        min_stock_level: parseInt(formData.min_stock_level, 10) || 0,
      }
      if (product) {
        await Product.update(product.id, dataToSave);
      } else {
        await Product.create(dataToSave);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-3xl w-full"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">Product Name</Label>
                  <Input id="product_name" value={formData.product_name} onChange={(e) => handleInputChange('product_name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store_id">Store</Label>
                  <Select value={formData.store_id} onValueChange={(val) => handleInputChange('store_id', val)}>
                    <SelectTrigger><SelectValue placeholder="Select a store" /></SelectTrigger>
                    <SelectContent>{stores.map(s => <SelectItem key={s.id} value={s.id}>{s.store_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_code">Product Code (SKU)</Label>
                  <Input id="product_code" value={formData.product_code} onChange={(e) => handleInputChange('product_code', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="unit_price">Unit Price (₹)</Label>
                  <Input type="number" id="unit_price" value={formData.unit_price} onChange={(e) => handleInputChange('unit_price', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input type="number" id="stock_quantity" value={formData.stock_quantity} onChange={(e) => handleInputChange('stock_quantity', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_stock_level">Min. Stock Level</Label>
                  <Input type="number" id="min_stock_level" value={formData.min_stock_level} onChange={(e) => handleInputChange('min_stock_level', e.target.value)} />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-indigo-500 to-indigo-600">
                  <Save className="w-4 h-4 mr-2" /> {isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}