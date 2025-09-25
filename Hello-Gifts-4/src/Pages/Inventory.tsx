import React, { useState, useEffect } from 'react';
import { Product, Store } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductForm from '../components/inventory/ProductForm';
import ProductList from '../components/inventory/ProductList';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, storesData] = await Promise.all([
        Product.list(),
        Store.list()
      ]);
      setProducts(productsData);
      setStores(storesData);
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
    setIsLoading(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    loadData();
    handleFormClose();
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-slate-600 mt-1">Track products and stock levels across all stores</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {showForm && (
            <ProductForm
              product={editingProduct}
              stores={stores}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
        </AnimatePresence>

        <ProductList
          products={products}
          stores={stores}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}