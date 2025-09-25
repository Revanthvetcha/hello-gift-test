import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Store, Calendar, Filter, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchFilters({ 
  searchQuery, 
  setSearchQuery, 
  selectedStore, 
  setSelectedStore,
  dateFilter,
  setDateFilter,
  orderStatusFilter,
  setOrderStatusFilter,
  stores 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by customer name, phone, order ID, or bill number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80"
              />
            </div>
            
            {/* Store Filter */}
            <div className="w-full lg:w-48">
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="bg-white/80">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-slate-500" />
                    <SelectValue placeholder="All Stores" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.store_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Date Filter */}
            <div className="w-full lg:w-40">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <SelectValue placeholder="All Time" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Status Filter */}
            <div className="w-full lg:w-44">
              <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                <SelectTrigger className="bg-white/80">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    <SelectValue placeholder="All Orders" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="pending_payment">Pending Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}