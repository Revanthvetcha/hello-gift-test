import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, BarChart3, Package, Download, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import jsPDF from 'jspdf';

// Mock data for different stores and time periods
const mockData = {
  stores: {
    'All Stores': {
      metrics: {
        totalRevenue: 1299,
        totalExpenses: 0,
        netProfit: 1299,
        avgOrderValue: 1299
      },
      salesByStore: [
        { store: 'Tech Hub Gurgaon', sales: 0 },
        { store: 'Downtown Electronics', sales: 1299 },
      ],
      salesTrend: {
        'Last 7 days': [
          { date: 'Day 1', sales: 800 },
          { date: 'Day 2', sales: 950 },
          { date: 'Day 3', sales: 1100 },
          { date: 'Day 4', sales: 1299 },
          { date: 'Day 5', sales: 1150 },
          { date: 'Day 6', sales: 1000 },
          { date: 'Day 7', sales: 1200 },
        ],
        'Last 30 days': [
          { date: 'Week 1', sales: 3200 },
          { date: 'Week 2', sales: 4100 },
          { date: 'Week 3', sales: 3800 },
          { date: 'Week 4', sales: 5200 },
        ],
        'This Month': [
          { date: 'Sep 01', sales: 800 },
          { date: 'Sep 02', sales: 950 },
          { date: 'Sep 03', sales: 1100 },
          { date: 'Sep 04', sales: 1299 },
          { date: 'Sep 05', sales: 1150 },
          { date: 'Sep 06', sales: 1000 },
          { date: 'Sep 07', sales: 1200 },
        ],
        'This Year': [
          { date: 'Jan', sales: 15000 },
          { date: 'Feb', sales: 18000 },
          { date: 'Mar', sales: 22000 },
          { date: 'Apr', sales: 19000 },
          { date: 'May', sales: 25000 },
          { date: 'Jun', sales: 28000 },
          { date: 'Jul', sales: 24000 },
          { date: 'Aug', sales: 26000 },
          { date: 'Sep', sales: 1299 },
        ]
      }
    },
    'Tech Hub Gurgaon': {
      metrics: {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        avgOrderValue: 0
      },
      salesByStore: [
        { store: 'Tech Hub Gurgaon', sales: 0 },
      ],
      salesTrend: {
        'Last 7 days': [
          { date: 'Day 1', sales: 0 },
          { date: 'Day 2', sales: 0 },
          { date: 'Day 3', sales: 0 },
          { date: 'Day 4', sales: 0 },
          { date: 'Day 5', sales: 0 },
          { date: 'Day 6', sales: 0 },
          { date: 'Day 7', sales: 0 },
        ],
        'Last 30 days': [
          { date: 'Week 1', sales: 0 },
          { date: 'Week 2', sales: 0 },
          { date: 'Week 3', sales: 0 },
          { date: 'Week 4', sales: 0 },
        ],
        'This Month': [
          { date: 'Sep 01', sales: 0 },
          { date: 'Sep 02', sales: 0 },
          { date: 'Sep 03', sales: 0 },
          { date: 'Sep 04', sales: 0 },
          { date: 'Sep 05', sales: 0 },
          { date: 'Sep 06', sales: 0 },
          { date: 'Sep 07', sales: 0 },
        ],
        'This Year': [
          { date: 'Jan', sales: 0 },
          { date: 'Feb', sales: 0 },
          { date: 'Mar', sales: 0 },
          { date: 'Apr', sales: 0 },
          { date: 'May', sales: 0 },
          { date: 'Jun', sales: 0 },
          { date: 'Jul', sales: 0 },
          { date: 'Aug', sales: 0 },
          { date: 'Sep', sales: 0 },
        ]
      }
    },
    'Downtown Electronics': {
      metrics: {
        totalRevenue: 1299,
        totalExpenses: 0,
        netProfit: 1299,
        avgOrderValue: 1299
      },
      salesByStore: [
        { store: 'Downtown Electronics', sales: 1299 },
      ],
      salesTrend: {
        'Last 7 days': [
          { date: 'Day 1', sales: 800 },
          { date: 'Day 2', sales: 950 },
          { date: 'Day 3', sales: 1100 },
          { date: 'Day 4', sales: 1299 },
          { date: 'Day 5', sales: 1150 },
          { date: 'Day 6', sales: 1000 },
          { date: 'Day 7', sales: 1200 },
        ],
        'Last 30 days': [
          { date: 'Week 1', sales: 3200 },
          { date: 'Week 2', sales: 4100 },
          { date: 'Week 3', sales: 3800 },
          { date: 'Week 4', sales: 5200 },
        ],
        'This Month': [
          { date: 'Sep 01', sales: 800 },
          { date: 'Sep 02', sales: 950 },
          { date: 'Sep 03', sales: 1100 },
          { date: 'Sep 04', sales: 1299 },
          { date: 'Sep 05', sales: 1150 },
          { date: 'Sep 06', sales: 1000 },
          { date: 'Sep 07', sales: 1200 },
        ],
        'This Year': [
          { date: 'Jan', sales: 15000 },
          { date: 'Feb', sales: 18000 },
          { date: 'Mar', sales: 22000 },
          { date: 'Apr', sales: 19000 },
          { date: 'May', sales: 25000 },
          { date: 'Jun', sales: 28000 },
          { date: 'Jul', sales: 24000 },
          { date: 'Aug', sales: 26000 },
          { date: 'Sep', sales: 1299 },
        ]
      }
    }
  }
};

// Utility functions
const getStoreData = (storeName: string) => {
  return mockData.stores[storeName as keyof typeof mockData.stores] || mockData.stores['All Stores'];
};

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString()}`;
};

// PDF Generator
const generatePDF = (metrics: any, storeData: any[], selectedStore: string, selectedPeriod: string) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 20;
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Business Analytics Report', pageWidth / 2, 30, { align: 'center' });
    
    // Date and filters
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    pdf.text(`Generated on ${currentDate}`, pageWidth / 2, 45, { align: 'center' });
    pdf.text(`Period: ${selectedPeriod} | Store: ${selectedStore}`, pageWidth / 2, 55, { align: 'center' });
    
    // Line separator
    pdf.setLineWidth(0.5);
    pdf.line(margin, 65, pageWidth - margin, 65);
    
    // Metrics section
    let yPosition = 85;
    
    // Metrics boxes
    const boxWidth = 80;
    const boxHeight = 25;
    const spacing = 15;
    const startX = margin;
    
    // Total Revenue
    pdf.setFillColor(34, 197, 94);
    pdf.rect(startX, yPosition, boxWidth, boxHeight, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(metrics.totalRevenue, startX + boxWidth/2, yPosition + 12, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('Total Revenue', startX + boxWidth/2, yPosition + 20, { align: 'center' });
    
    // Total Expenses
    pdf.setFillColor(239, 68, 68);
    pdf.rect(startX + boxWidth + spacing, yPosition, boxWidth, boxHeight, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(metrics.totalExpenses, startX + boxWidth + spacing + boxWidth/2, yPosition + 12, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('Total Expenses', startX + boxWidth + spacing + boxWidth/2, yPosition + 20, { align: 'center' });
    
    // Net Profit
    pdf.setFillColor(59, 130, 246);
    pdf.rect(startX + 2 * (boxWidth + spacing), yPosition, boxWidth, boxHeight, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(metrics.netProfit, startX + 2 * (boxWidth + spacing) + boxWidth/2, yPosition + 12, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('Net Profit', startX + 2 * (boxWidth + spacing) + boxWidth/2, yPosition + 20, { align: 'center' });
    
    yPosition += 40;
    
    // Avg Order Value
    pdf.setFillColor(147, 51, 234);
    pdf.rect(startX, yPosition, boxWidth, boxHeight, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(metrics.avgOrderValue, startX + boxWidth/2, yPosition + 12, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('Avg Order Value', startX + boxWidth/2, yPosition + 20, { align: 'center' });
    
    // Sales by Store table
    yPosition += 50;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Sales by Store', margin, yPosition);
    
    yPosition += 20;
    
    // Table headers
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Store', margin, yPosition);
    pdf.text('Revenue', margin + 80, yPosition);
    pdf.text('Orders', margin + 140, yPosition);
    
    // Table data
    pdf.setFont('helvetica', 'normal');
    storeData.forEach((store) => {
      yPosition += 15;
      pdf.text(store.name, margin, yPosition);
      pdf.text(`₹${store.revenue.toLocaleString()}`, margin + 80, yPosition);
      pdf.text(store.orders.toString(), margin + 140, yPosition);
    });
    
    // Footer
    yPosition = pdf.internal.pageSize.height - 30;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('This is a computer-generated report from BizManager Pro Business Suite.', 
             pageWidth / 2, yPosition, { align: 'center' });
    
    // Save the PDF
    pdf.save(`business-analytics-report-${selectedPeriod.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    return false;
  }
};

// Components
const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  gradient: string;
}> = ({ title, value, icon: Icon, gradient }) => {
  return (
    <div className={`${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const Dropdown: React.FC<{
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = ({  options, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`} >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-gray-700">{value}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SalesByStoreChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Sales by Store</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="store" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Bar 
            dataKey="sales" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity duration-200"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-gray-800 font-medium">{label}</p>
        <p className="text-emerald-600 font-semibold">
          Sales: ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const SalesTrendChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Sales Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main App Component
function App() {
  const [selectedStore, setSelectedStore] = useState('All Stores');
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const storeOptions = ['All Stores', 'Tech Hub Gurgaon', 'Downtown Electronics'];
  const periodOptions = ['Last 7 days', 'Last 30 days', 'This Month', 'This Year'];

  // Get current data based on selections
  const currentData = useMemo(() => {
    const storeData = getStoreData(selectedStore);
    return {
      metrics: storeData.metrics,
      salesByStore: storeData.salesByStore,
      salesTrend: storeData.salesTrend[selectedPeriod as keyof typeof storeData.salesTrend] || storeData.salesTrend['This Month']
    };
  }, [selectedStore, selectedPeriod]);

  const handleExportPDF = () => {
    const metrics = {
      totalRevenue: formatCurrency(currentData.metrics.totalRevenue),
      totalExpenses: formatCurrency(currentData.metrics.totalExpenses),
      netProfit: formatCurrency(currentData.metrics.netProfit),
      avgOrderValue: formatCurrency(currentData.metrics.avgOrderValue)
    };

    const storeData = currentData.salesByStore.map(store => ({
      name: store.store,
      revenue: store.sales,
      orders: store.sales > 0 ? 1 : 0
    }));

    const success = generatePDF(metrics, storeData, selectedStore, selectedPeriod);
    if (success) {
      console.log('PDF generated successfully');
    }
  };

  return (
    <div className="min-h-screen p-6 overflow-y-auto" style={{ backgroundColor: '#EFF6FF', width: '100%' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Analytics</h1>
            <p className="text-gray-600 text-sm">Comprehensive insights and performance metrics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
            <Dropdown
              label="Store"
              options={storeOptions}
              value={selectedStore}
              onChange={setSelectedStore}
              className="w-full sm:w-48"
            />
            <Dropdown
              label="Period"
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              className="w-full sm:w-48"
            />
            <button
              onClick={handleExportPDF}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 font-medium"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(currentData.metrics.totalRevenue)}
            icon={DollarSign}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(currentData.metrics.totalExpenses)}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-red-500 to-red-600"
          />
          <MetricCard
            title="Net Profit"
            value={formatCurrency(currentData.metrics.netProfit)}
            icon={BarChart3}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Avg Order Value"
            value={formatCurrency(currentData.metrics.avgOrderValue)}
            icon={Package}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SalesByStoreChart data={currentData.salesByStore} />
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Expenses by Category</h3>
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-center">
                No expense data available for the selected period
              </p>
            </div>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="mb-8">
          <SalesTrendChart data={currentData.salesTrend} />
        </div>
      </div>
    </div>
  );
}

export default App;