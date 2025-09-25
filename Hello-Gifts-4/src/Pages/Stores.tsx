import React, { useState, useEffect } from "react";
import { Store } from "@/entities/Store.json";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Plus, Store as StoreIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// These would be new components
import StoreList from "../components/stores/StoreList";
import StoreForm from "../components/stores/StoreForm";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setIsLoading(true);
    try {
      const data = await Store.list();
      setStores(data);
    } catch (error) {
      console.error("Error loading stores:", error);
    }
    setIsLoading(false);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleFormSuccess = () => {
    loadStores();
    handleFormClose();
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setShowForm(true);
  };
  
  const handleAddNew = () => {
    setEditingStore(null);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Manage Stores
            </h1>
            <p className="text-slate-600 mt-1">Add, edit, and view your business locations</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Button 
              onClick={handleAddNew}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Store
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showForm && (
            <StoreForm 
              store={editingStore}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
        </AnimatePresence>

        <StoreList 
          stores={stores}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}