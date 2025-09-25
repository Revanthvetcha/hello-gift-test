import React, { useState } from 'react';
import { Store } from '@/entities/Store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save } from "lucide-react";
import { motion } from 'framer-motion';

export default function StoreForm({ store, onClose, onSuccess }) {
  const [formData, setFormData] = useState(store || {
    store_name: '',
    address: '',
    contact_number: '',
    logo_url: '',
    gstin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (store) {
        await Store.update(store.id, formData);
      } else {
        await Store.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving store:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-2xl w-full"
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{store ? 'Edit Store' : 'Add New Store'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store_name">Store Name</Label>
                <Input id="store_name" value={formData.store_name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input id="contact_number" value={formData.contact_number} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input id="gstin" value={formData.gstin} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input id="logo_url" value={formData.logo_url} onChange={handleInputChange} placeholder="https://example.com/logo.png" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" /> {isSubmitting ? 'Saving...' : 'Save Store'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}