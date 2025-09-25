
import React, { useState, useEffect } from "react";
import { Sale, Store, Product } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Receipt, 
  Download,
  Phone,
  User,
  Hash,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import SaleForm from "../components/sales/SaleForm";
import SalesList from "../components/sales/SalesList";
import SearchFilters from "../components/sales/SearchFilters";
import BillPDF from "../components/sales/BillPdf";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [saleToPrint, setSaleToPrint] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, storesData] = await Promise.all([
        Sale.list('-created_date'),
        Store.list()
      ]);
      setSales(salesData);
      setStores(storesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSaleCreated = () => {
    loadData();
    setShowForm(false);
  };

  const handleUpdateStatus = async (sale) => {
    try {
      await Sale.update(sale.id, { 
        order_status: 'delivered',
        balance_amount: 0 // Clear the balance as payment is now complete
      });
      loadData(); // Refresh the list to show the new status
    } catch (error) {
      console.error("Error updating sale status:", error);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = !searchQuery || 
      sale.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer_phone.includes(searchQuery) ||
      sale.bill_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.order_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStore = selectedStore === "all" || sale.store_id === selectedStore;
    const matchesOrderStatus = orderStatusFilter === "all" || sale.order_status === orderStatusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const today = new Date();
      const saleDate = new Date(sale.sale_date);
      
      if (dateFilter === "today") {
        matchesDate = saleDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = saleDate >= weekAgo;
      } else if (dateFilter === "month") {
        matchesDate = saleDate.getMonth() === today.getMonth() && 
                    saleDate.getFullYear() === today.getFullYear();
      }
    }
    
    return matchesSearch && matchesStore && matchesDate && matchesOrderStatus;
  });

  const handlePrint = (sale) => {
    const store = stores.find(s => s.id === sale.store_id);
    if (store) {
      setSaleToPrint({ sale, store });
    }
  };

  return (
    <>
      <div className="p-4 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Sales & Billing
              </h1>
              <p className="text-slate-600 mt-1">Manage your sales and generate professional bills</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Sale
              </Button>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <SearchFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            orderStatusFilter={orderStatusFilter}
            setOrderStatusFilter={setOrderStatusFilter}
            stores={stores}
          />

          {/* Sale Form Modal */}
          <AnimatePresence>
            {showForm && (
              <SaleForm 
                stores={stores}
                onClose={() => setShowForm(false)}
                onSuccess={handleSaleCreated}
              />
            )}
          </AnimatePresence>

          {/* Sales List */}
          <SalesList 
            sales={filteredSales}
            stores={stores}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onPrint={handlePrint}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>

      {/* PDF Generation Component */}
      {saleToPrint && (
        <BillPDF 
          sale={saleToPrint.sale} 
          store={saleToPrint.store} 
        />
      )}
    </>
  );
}
