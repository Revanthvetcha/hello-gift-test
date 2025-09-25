import React from 'react';
import { 
  Store, 
  Receipt, 
  Users, 
  Package, 
  TrendingUp, 
  Target,
  Calendar,
  DollarSign
} from 'lucide-react';

interface MainContentProps {
  activeSection: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  cardBg: string;
}

function MetricCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, cardBg }: MetricCardProps) {
  return (
    <div className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 ${cardBg}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
}

interface SalesActivityItemProps {
  name: string;
  billNumber: string;
  phone: string;
  amount: string;
  date: string;
  avatar: string;
}

function SalesActivityItem({ name, billNumber, phone, amount, date, avatar }: SalesActivityItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-600">{billNumber}</div>
          <div className="text-sm text-gray-500">{phone}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-green-600 text-lg">{amount}</div>
        <div className="text-sm text-gray-500">{date}</div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const salesActivity = [
    {
      name: "Vijay",
      billNumber: "Bill #BILL-175696829574",
      phone: "8019911168",
      amount: "₹1,299",
      date: "Sep 4, 2025",
      avatar: "74"
    },
    {
      name: "Sanju",
      billNumber: "Bill #BILL-175637633254",
      phone: "8019911168",
      amount: "₹1,499",
      date: "Aug 29, 2025",
      avatar: "54"
    },
    {
      name: "Vijay",
      billNumber: "Bill #BILL-175636126226",
      phone: "8019911168",
      amount: "₹1,299",
      date: "Aug 28, 2025",
      avatar: "26"
    },
    {
      name: "Rajath",
      billNumber: "Bill #BILL-175630460322",
      phone: "8019911168",
      amount: "₹1,768.82",
      date: "Aug 27, 2025",
      avatar: "22"
    },
    {
      name: "Amit Patel",
      billNumber: "Bill #BILL-001",
      phone: "+91-98888-77777",
      amount: "₹88,500",
      date: "Dec 22, 2024",
      avatar: "01"
    }
  ];

  return (
    <div className="p-8 min-h-full" style={{ backgroundColor: "#EFF6FF" }}>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
          <p className="text-gray-600 text-lg mb-4">
            Welcome back! Here's what's happening with your business today.
          </p>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Wednesday, September 10, 2025</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         <MetricCard
                title="Total Stores"
                value="2"
                subtitle="+2 this month"
                icon={Store}
                iconColor="text-white"
                iconBg="bg-blue-500"
                cardBg="bg-blue-50 shadow-md hover:shadow-lg "
            />

          <MetricCard
            title="Today's Sales"
            value="0"
            subtitle="₹0"
            icon={Receipt}
            iconColor="text-white"
            iconBg="bg-green-500"
            cardBg="bg-green-50 shadow-md hover:shadow-lg"
          />
          <MetricCard
            title="Total Employees"
            value="3"
            subtitle="Active workforce"
            icon={Users}
            iconColor="text-white"
            iconBg="bg-purple-500"
            cardBg="bg-purple-50 shadow-md hover:shadow-lg"
          />
          <MetricCard
            title="Inventory Items"
            value="3"
            subtitle="Across all stores"
            icon={Package}
            iconColor="text-white"
            iconBg="bg-orange-500"
            cardBg="bg-orange-50 shadow-md hover:shadow-lg"
          />
          <MetricCard
            title="Monthly Expenses"
            value="₹0"
            subtitle="September 2025"
            icon={TrendingUp}
            iconColor="text-white"
            iconBg="bg-red-500"
            cardBg="bg-red-50 shadow-md hover:shadow-lg"
          />
          <MetricCard
            title="Revenue Goal"
            value="₹2,50,000"
            subtitle="0% achieved"
            icon={Target}
            iconColor="text-white"
            iconBg="bg-blue-600"
            cardBg="bg-indigo-50 shadow-md hover:shadow-lg"
          />
        </div>

        {/* Recent Sales Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Recent Sales Activity</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {salesActivity.map((sale, index) => (
              <SalesActivityItem
                key={index}
                name={sale.name}
                billNumber={sale.billNumber}
                phone={sale.phone}
                amount={sale.amount}
                date={sale.date}
                avatar={sale.avatar}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MainContent({ activeSection }: MainContentProps) {
  if (activeSection === 'dashboard') {
    return (
      <div className="flex-1 overflow-y-auto">
        <DashboardContent />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
          <p className="text-gray-600 mb-8">
            Welcome to the {activeSection} section of BizManager Pro Business Suite.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Feature {item}</h3>
                <p className="text-gray-600 text-sm">
                  This is a placeholder for {activeSection} feature {item}. 
                  Click on different navigation items to see the content change.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
