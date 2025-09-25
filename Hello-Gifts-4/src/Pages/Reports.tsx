import React, { useState, useEffect, useCallback } from 'react';
import { Sale, Expense, Employee, Store, Product } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, TrendingUp, DollarSign, Users, Package } from "lucide-react";
import { motion } from 'framer-motion';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedStore, setSelectedStore] = useState('all');
  const [stores, setStores] = useState([]);

  const loadReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sales, expenses, employees, allStores, products] = await Promise.all([
        Sale.list(),
        Expense.list(),
        Employee.list(),
        Store.list(),
        Product.list()
      ]);

      setStores(allStores);

      // Filter data based on selected period
      const now = new Date();
      let startDate, endDate;
      
      switch (selectedPeriod) {
        case 'last7days':
          startDate = subDays(now, 7);
          endDate = now;
          break;
        case 'last30days':
          startDate = subDays(now, 30);
          endDate = now;
          break;
        case 'thisMonth':
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = now;
          break;
        default:
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
      }

      // Filter by store if selected
      const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        const dateInRange = saleDate >= startDate && saleDate <= endDate;
        const storeMatch = selectedStore === 'all' || String(sale.store_id) === String(selectedStore);
        return dateInRange && storeMatch;
      });

      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.expense_date);
        const dateInRange = expenseDate >= startDate && expenseDate <= endDate;
        const storeMatch = selectedStore === 'all' || String(expense.store_id) === String(selectedStore);
        return dateInRange && storeMatch;
      });

      // Calculate metrics
      const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
      const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const netProfit = totalRevenue - totalExpenses;
      const avgOrderValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

      // Sales by store
      const salesByStore = allStores.map(store => {
        const storeSales = filteredSales.filter(sale => String(sale.store_id) === String(store.id));
        const revenue = storeSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
        return {
          name: store.store_name,
          revenue,
          orders: storeSales.length
        };
      });

      // Expenses by category
      const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
        const category = expense.category 
          ? expense.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          : 'Uncategorized';
        acc[category] = (acc[category] || 0) + (expense.amount || 0);
        return acc;
      }, {});

      const expensesChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value
      }));

      // Daily sales trend
      const dailySales = {};
      filteredSales.forEach(sale => {
        const saleDate = new Date(sale.sale_date);
        if (!isNaN(saleDate.getTime())) {
          const date = format(saleDate, 'MMM dd');
          dailySales[date] = (dailySales[date] || 0) + (sale.total_amount || 0);
        }
      });

      const salesTrendData = Object.entries(dailySales).map(([date, amount]) => ({
        date,
        sales: amount
      }));

      setReportData({
        summary: {
          totalRevenue,
          totalExpenses,
          netProfit,
          avgOrderValue,
          totalOrders: filteredSales.length,
          totalEmployees: employees.length,
          totalProducts: products.length
        },
        salesByStore,
        expensesChartData,
        salesTrendData
      });

    } catch (error) {
      console.error("Error loading report data:", error);
      // Set default empty data on error
      setReportData({
        summary: {
          totalRevenue: 0,
          totalExpenses: 0,
          netProfit: 0,
          avgOrderValue: 0,
          totalOrders: 0,
          totalEmployees: 0,
          totalProducts: 0
        },
        salesByStore: [],
        expensesChartData: [],
        salesTrendData: []
      });
    }
    setIsLoading(false);
  }, [selectedPeriod, selectedStore]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const handleDownloadReport = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded" />
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-4 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Available</h3>
              <p className="text-slate-500">Unable to load report data. Please try again.</p>
              <Button onClick={loadReportData} className="mt-4">Retry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-8 min-h-screen print:hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Business Analytics
              </h1>
              <p className="text-slate-600 mt-1">Comprehensive insights and performance metrics</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={String(store.id)}>{store.store_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleDownloadReport}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </motion.div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Total Revenue</p>
                      <p className="text-2xl font-bold">₹{reportData.summary.totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Total Expenses</p>
                      <p className="text-2xl font-bold">₹{reportData.summary.totalExpenses.toLocaleString('en-IN')}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Net Profit</p>
                      <p className="text-2xl font-bold">₹{reportData.summary.netProfit.toLocaleString('en-IN')}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Avg Order Value</p>
                      <p className="text-2xl font-bold">₹{Math.round(reportData.summary.avgOrderValue).toLocaleString('en-IN')}</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales by Store */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Sales by Store</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.salesByStore.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.salesByStore}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-slate-500">
                    No sales data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expenses by Category */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.expensesChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.expensesChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportData.expensesChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-slate-500">
                    No expense data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sales Trend */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.salesTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={reportData.salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']} />
                    <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-slate-500">
                  No sales trend data available for the selected period
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden Print Version */}
      <div className="hidden print:block p-8 bg-white">
        <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Business Analytics Report</h1>
          <p className="text-slate-600">Generated on {format(new Date(), 'PPP')}</p>
          <p className="text-slate-500">
            Period: {selectedPeriod.replace(/([A-Z])/g, ' $1').toLowerCase()} | 
            Store: {selectedStore === 'all' ? 'All Stores' : stores.find(s => String(s.id) === selectedStore)?.store_name || 'Unknown'}
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 border rounded">
            <p className="font-bold text-2xl text-green-600">₹{reportData.summary.totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-slate-500">Total Revenue</p>
          </div>
          <div className="text-center p-4 border rounded">
            <p className="font-bold text-2xl text-red-600">₹{reportData.summary.totalExpenses.toLocaleString('en-IN')}</p>
            <p className="text-sm text-slate-500">Total Expenses</p>
          </div>
          <div className="text-center p-4 border rounded">
            <p className="font-bold text-2xl text-blue-600">₹{reportData.summary.netProfit.toLocaleString('en-IN')}</p>
            <p className="text-sm text-slate-500">Net Profit</p>
          </div>
          <div className="text-center p-4 border rounded">
            <p className="font-bold text-2xl text-purple-600">₹{Math.round(reportData.summary.avgOrderValue).toLocaleString('en-IN')}</p>
            <p className="text-sm text-slate-500">Avg Order Value</p>
          </div>
        </div>

        {/* Print Charts Data */}
        {reportData.salesByStore.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Sales by Store</h3>
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left">Store</th>
                  <th className="border border-slate-300 p-2 text-right">Revenue</th>
                  <th className="border border-slate-300 p-2 text-right">Orders</th>
                </tr>
              </thead>
              <tbody>
                {reportData.salesByStore.map((store, index) => (
                  <tr key={index}>
                    <td className="border border-slate-300 p-2">{store.name}</td>
                    <td className="border border-slate-300 p-2 text-right">₹{store.revenue.toLocaleString('en-IN')}</td>
                    <td className="border border-slate-300 p-2 text-right">{store.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-center text-slate-500 text-sm mt-8 border-t pt-4">
          This is a computer-generated report from BizManager Pro Business Suite.
        </p>
      </div>
    </>
  );
}