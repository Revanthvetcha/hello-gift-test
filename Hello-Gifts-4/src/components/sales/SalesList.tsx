
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Download, Phone, MapPin, IndianRupee, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function SalesList({ sales, stores, isLoading, searchQuery, onPrint, onUpdateStatus }) {
  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.store_name || "Unknown Store";
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      cash: "bg-green-100 text-green-800",
      online_upi: "bg-blue-100 text-blue-800",
      partial_payment: "bg-orange-100 text-orange-800"
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800",
      pending_payment: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getOrderStatusIcon = (status) => {
    return status === 'delivered' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: "Cash",
      online_upi: "Online UPI",
      partial_payment: "Partial Payment"
    };
    return labels[method] || method;
  };

  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sales.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm">
        <CardContent className="text-center py-12">
          <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {searchQuery ? "No sales found" : "No sales yet"}
          </h3>
          <p className="text-slate-500">
            {searchQuery 
              ? "Try adjusting your search criteria"
              : "Create your first sale to get started"
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-green-600" />
          Sales History ({sales.length} sales)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Sale Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {sale.bill_number.slice(-2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-bold text-lg text-slate-900">
                          {sale.customer_name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {getStoreName(sale.store_id)}
                        </Badge>
                        <Badge className={getOrderStatusColor(sale.order_status)}>
                          {getOrderStatusIcon(sale.order_status)}
                          <span className="ml-1">
                            {sale.order_status === 'delivered' ? 'Delivered' : 'Pending Payment'}
                          </span>
                        </Badge>
                        {sale.order_status === 'pending_payment' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs px-2 border-green-300 text-green-700 hover:bg-green-50"
                            onClick={() => onUpdateStatus(sale)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        Order #{sale.order_id} • Bill #{sale.bill_number}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                        {sale.customer_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {sale.customer_phone}
                          </div>
                        )}
                        {sale.customer_address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {sale.customer_address.slice(0, 50)}...
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <Badge className={getPaymentMethodColor(sale.payment_method)}>
                          {getPaymentMethodLabel(sale.payment_method)}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {format(new Date(sale.sale_date), 'MMM d, yyyy')}
                        </span>
                      </div>

                      {sale.payment_method === 'partial_payment' && (
                        <div className="mt-2 text-sm">
                          <span className="text-green-600">Advance: ₹{sale.advance_amount.toLocaleString('en-IN')}</span>
                          <span className="text-slate-400 mx-2">•</span>
                          <span className="text-red-600">Balance: ₹{sale.balance_amount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {sale.total_amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-slate-500">
                      {sale.items?.length || 0} items
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => onPrint(sale)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
