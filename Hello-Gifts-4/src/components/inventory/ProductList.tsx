import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Pencil, Store } from "lucide-react";
import { motion } from 'framer-motion';

export default function ProductList({ products, stores, isLoading, onEdit }) {
  const getStoreName = (storeId) => stores.find(s => s.id === storeId)?.store_name || "N/A";

  const getStockColor = (quantity, minLevel) => {
    if (quantity === 0) return "bg-red-100 text-red-800";
    if (quantity <= minLevel) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (isLoading) {
    return (
      <Card><CardContent className="p-6"><div className="animate-pulse bg-slate-200 h-64 rounded-lg" /></CardContent></Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border p-4 flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{product.product_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{product.product_code}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onEdit(product)}><Pencil className="w-4 h-4" /></Button>
              </div>
              <div className="mt-2 text-sm space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <Store className="w-4 h-4 text-slate-400" /> {getStoreName(product.store_id)}
                </div>
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <div className="mt-4 flex-1" />
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-500">Price</p>
                  <p className="font-bold text-lg flex items-center">
                    <IndianRupee className="w-4 h-4" />{product.unit_price}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 text-right">Stock</p>
                  <Badge className={`font-bold ${getStockColor(product.stock_quantity, product.min_stock_level)}`}>
                    {product.stock_quantity} {product.unit}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}