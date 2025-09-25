import React, { useState } from "react";
import { Sale } from "@/entities/Sale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2, Receipt, Save } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function SaleForm({ stores, onClose, onSuccess }) {
  const [saleData, setSaleData] = useState({
    store_id: "",
    order_id: "",
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    items: [{ product_name: "", quantity: 1, unit_price: 0, total: 0 }],
    sale_date: format(new Date(), 'yyyy-MM-dd'),
    payment_method: "cash",
    advance_amount: 0,
    balance_amount: 0,
    order_status: "delivered"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setSaleData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...saleData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = (newItems[index].quantity || 0) * (newItems[index].unit_price || 0);
    }
    
    setSaleData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setSaleData(prev => ({
      ...prev,
      items: [...prev.items, { product_name: "", quantity: 1, unit_price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    setSaleData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const subtotal = saleData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = subtotal;
    return { subtotal, total };
  };

  const handlePaymentMethodChange = (method) => {
    setSaleData(prev => {
      const { subtotal } = calculateTotals();
      let newData = { ...prev, payment_method: method };
      
      if (method === "cash" || method === "online_upi") {
        newData.advance_amount = 0;
        newData.balance_amount = 0;
        newData.order_status = "delivered";
      } else if (method === "partial_payment") {
        newData.advance_amount = 0;
        newData.balance_amount = subtotal;
        newData.order_status = "pending_payment";
      }
      
      return newData;
    });
  };

  const handleAdvanceAmountChange = (amount) => {
    const { subtotal } = calculateTotals();
    const advanceAmount = parseFloat(amount) || 0;
    const balanceAmount = Math.max(0, subtotal - advanceAmount);
    
    setSaleData(prev => ({
      ...prev,
      advance_amount: advanceAmount,
      balance_amount: balanceAmount,
      order_status: balanceAmount > 0 ? "pending_payment" : "delivered"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { subtotal, total } = calculateTotals();
      const billNumber = `BILL-${Date.now()}`;
      
      await Sale.create({
        ...saleData,
        bill_number: billNumber,
        subtotal,
        total_amount: total,
        advance_amount: parseFloat(saleData.advance_amount) || 0,
        balance_amount: parseFloat(saleData.balance_amount) || 0
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error creating sale:", error);
    }
    
    setIsSubmitting(false);
  };

  const { subtotal, total } = calculateTotals();

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
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Create New Sale
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store, Order ID & Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_id">Store</Label>
                  <Select 
                    value={saleData.store_id} 
                    onValueChange={(value) => handleInputChange('store_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map(store => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.store_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order_id">Order ID</Label>
                  <Input
                    id="order_id"
                    value={saleData.order_id}
                    onChange={(e) => handleInputChange('order_id', e.target.value)}
                    placeholder="Enter Order ID"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sale_date">Sale Date</Label>
                  <Input
                    id="sale_date"
                    type="date"
                    value={saleData.sale_date}
                    onChange={(e) => handleInputChange('sale_date', e.target.value)}
                  />
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    value={saleData.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">Customer Phone</Label>
                  <Input
                    id="customer_phone"
                    value={saleData.customer_phone}
                    onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer_address">Customer Address</Label>
                <Textarea
                  id="customer_address"
                  value={saleData.customer_address}
                  onChange={(e) => handleInputChange('customer_address', e.target.value)}
                  placeholder="Enter customer address"
                  rows={2}
                />
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Items</Label>
                  <Button type="button" onClick={addItem} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {saleData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 p-4 bg-slate-50 rounded-lg">
                      <Input
                        placeholder="Product name"
                        value={item.product_name}
                        onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <div className="w-24 flex items-center font-semibold">
                        ₹{item.total.toFixed(2)}
                      </div>
                      {saleData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select 
                      value={saleData.payment_method} 
                      onValueChange={handlePaymentMethodChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash (Full Payment)</SelectItem>
                        <SelectItem value="online_upi">Online UPI (Full Payment)</SelectItem>
                        <SelectItem value="partial_payment">Partial Payment (Advance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {saleData.payment_method === "partial_payment" && (
                    <>
                      <div className="space-y-2">
                        <Label>Advance Amount</Label>
                        <Input
                          type="number"
                          value={saleData.advance_amount}
                          onChange={(e) => handleAdvanceAmountChange(e.target.value)}
                          placeholder="Enter advance amount"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Balance Amount</Label>
                        <Input
                          type="number"
                          value={saleData.balance_amount}
                          readOnly
                          className="bg-slate-100"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Order Status</Label>
                    <Select 
                      value={saleData.order_status} 
                      onValueChange={(value) => handleInputChange('order_status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="pending_payment">Pending Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                      <span>Total Amount:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    {saleData.payment_method === "partial_payment" && (
                      <>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span>Advance Paid:</span>
                          <span className="text-green-600">₹{saleData.advance_amount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Balance Due:</span>
                          <span className="text-red-600">₹{saleData.balance_amount}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {isSubmitting ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Sale
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}