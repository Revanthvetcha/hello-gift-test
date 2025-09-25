import React, { useState, useEffect } from "react";
import { Store, Sale, Employee, Expense, Product } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Store as StoreIcon, 
  Receipt, 
  Users, 
  Package,
  IndianRupee,
  Calendar,
  Target
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStores: 0,
    todaysSales: 0,
    todaysRevenue: 0,
    totalEmployees: 0,
    totalProducts: 0,
    monthlyExpenses: 0,
    recentSales: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [stores, sales, employees, expenses, products] = await Promise.all([
        Store.list(),
        Sale.list('-created_date', 50),
        Employee.list(),
        Expense.list(),
        Product.list()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todaysSales = sales.filter(sale => sale.sale_date === today);
      const thisMonth = format(new Date(), 'yyyy-MM');
      const monthlyExpenses = expenses
        .filter(expense => expense.expense_date.startsWith(thisMonth))
        .reduce((sum, expense) => sum + expense.amount, 0);

      setStats({
        totalStores: stores.length,
        todaysSales: todaysSales.length,
        todaysRevenue: todaysSales.reduce((sum, sale) => sum + sale.total_amount, 0),
        totalEmployees: employees.length,
        totalProducts: products.length,
        monthlyExpenses,
        recentSales: sales.slice(0, 10)
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const statCards = [
    {
      title: "Total Stores",
      value: stats.totalStores,
      icon: StoreIcon,
      color: "from-blue-500 to-blue-600",
      change: "+2 this month"
    },
    {
      title: "Today's Sales",
      value: stats.todaysSales,
      icon: Receipt,
      color: "from-green-500 to-green-600",
      change: `₹${stats.todaysRevenue.toLocaleString('en-IN')}`
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      change: "Active workforce"
    },
    {
      title: "Inventory Items",
      value: stats.totalProducts,
      icon: Package,
      color: "from-orange-500 to-orange-600",
      change: "Across all stores"
    },
    {
      title: "Monthly Expenses",
      value: `₹${stats.monthlyExpenses.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: "from-red-500 to-red-600",
      change: format(new Date(), 'MMMM yyyy')
    },
    {
      title: "Revenue Goal",
      value: "₹2,50,000",
      icon: Target,
      color: "from-indigo-500 to-indigo-600",
      change: `${Math.round((stats.todaysRevenue / 250000) * 100)}% achieved`
    }
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2">
              Business Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Welcome back! Here's what's happening with your business today.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <Receipt className="w-5 h-5 text-green-600" />
                Recent Sales Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-slate-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : stats.recentSales.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentSales.map((sale, index) => (
                    <motion.div
                      key={sale.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-slate-50 rounded-lg border border-slate-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {sale.bill_number.slice(-2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{sale.customer_name}</p>
                          <p className="text-sm text-slate-500">Bill #{sale.bill_number}</p>
                          <p className="text-xs text-slate-400">{sale.customer_phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600 flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {sale.total_amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(sale.sale_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No recent sales found</p>
                  <p className="text-sm text-slate-400">Sales will appear here once you start making them</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}