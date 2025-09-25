import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store as StoreIcon, Pencil, MapPin, Phone } from "lucide-react";
import { motion } from 'framer-motion';

export default function StoreList({ stores, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 h-48 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store, index) => (
        <motion.div
          key={store.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {store.logo_url ? (
                    <img src={store.logo_url} alt={`${store.store_name} logo`} className="w-16 h-16 rounded-lg object-contain bg-slate-100 p-1" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <StoreIcon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900">{store.store_name}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onEdit(store)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3 text-sm text-slate-600 flex-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{store.contact_number}</span>
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                  <p className="text-xs text-slate-500">GSTIN</p>
                  <p className="font-mono text-sm text-slate-700">{store.gstin}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}