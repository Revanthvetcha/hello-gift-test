import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, MapPin, DollarSign, Phone, Clock, CheckCircle, Store, Calendar, Package, X, Save, ChevronDown } from 'lucide-react';

interface Sale {
  id: number;
  customerName: string;
  storeName: string;
  orderId: string;
  billId: string;
  phone: string;
  address: string;
  amount: number;
  status: 'delivered' | 'pending';
  paymentType: string;
  date: string;
  items: number;
  advance?: number;
  balance?: number;
  avatar: string;
  itemDetails?: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface NewSaleItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState('all');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [newSaleItems, setNewSaleItems] = useState<NewSaleItem[]>([
    { id: 1, name: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [newSaleForm, setNewSaleForm] = useState({
    store: '',
    orderId: '',
    saleDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'Cash (Full Payment)',
    orderStatus: 'Delivered'
  });

  const salesData: Sale[] = [
    {
      id: 1,
      customerName: 'Vijay',
      storeName: 'Downtown Electronics',
      orderId: 'HGO192',
      billId: 'BILL-1756968299574',
      phone: '8019911168',
      address: 'Hyderabad',
      amount: 1299,
      status: 'pending',
      paymentType: 'Partial Payment',
      date: '2025-01-15',
      items: 1,
      advance: 500,
      balance: 799,
      avatar: '74',
      itemDetails: [
        { name: 'Wireless Headphones', quantity: 1, unitPrice: 1299, total: 1299 }
      ]
    },
    {
      id: 2,
      customerName: 'Sanju',
      storeName: 'Tech Hub Gurgaon',
      orderId: 'HGO193',
      billId: 'BILL-1756376233254',
      phone: '9876543210',
      address: 'Gurgaon',
      amount: 1100,
      status: 'delivered',
      paymentType: 'Cash',
      date: '2025-01-14',
      items: 2,
      avatar: '54',
      itemDetails: [
        { name: 'Photo Frame', quantity: 1, unitPrice: 1499, total: 1499 }
      ]
    },
    {
      id: 3,
      customerName: 'Rajath',
      storeName: 'Tech Hub Gurgaon',
      orderId: 'HGO194',
      billId: 'BILL-1756304606322',
      phone: '8019911168',
      address: 'Bangalore',
      amount: 1768.82,
      status: 'pending',
      paymentType: 'Cash',
      date: '2025-01-13',
      items: 1,
      avatar: '22',
      itemDetails: [
        { name: 'Smart Watch', quantity: 1, unitPrice: 1768.82, total: 1768.82 }
      ]
    },
    {
      id: 4,
      customerName: 'Amit Patel',
      storeName: 'Downtown Electronics',
      orderId: 'HGO195',
      billId: 'BILL-001',
      phone: '+91-98888-77777',
      address: '123 Residential Area, Delhi',
      amount: 88500,
      status: 'pending',
      paymentType: 'UPI',
      date: '2025-01-12',
      items: 1,
      avatar: '01',
      itemDetails: [
        { name: 'Laptop', quantity: 1, unitPrice: 88500, total: 88500 }
      ]
    },
    {
      id: 5,
      customerName: 'Sunita Verma',
      storeName: 'Downtown Electronics',
      orderId: 'HGO196',
      billId: 'BILL-002',
      phone: '+91-98888-88888',
      address: '456 Business District, Gurgaon',
      amount: 147500,
      status: 'delivered',
      paymentType: 'Card',
      date: '2025-01-11',
      items: 3,
      avatar: '02',
      itemDetails: [
        { name: 'Gaming Setup', quantity: 1, unitPrice: 147500, total: 147500 }
      ]
    },
    {
      id: 6,
      customerName: 'Priya Sharma',
      storeName: 'Tech Hub Gurgaon',
      orderId: 'HGO197',
      billId: 'BILL-003',
      phone: '9123456789',
      address: 'Mumbai',
      amount: 2500,
      status: 'delivered',
      paymentType: 'UPI',
      date: '2025-01-10',
      items: 2,
      avatar: 'PS',
      itemDetails: [
        { name: 'Phone Case', quantity: 2, unitPrice: 1250, total: 2500 }
      ]
    }
  ];

  const filteredSales = useMemo(() => {
    return salesData.filter(sale => {
      const matchesSearch = searchQuery === '' || 
        sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.phone.includes(searchQuery) ||
        sale.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.billId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStore = selectedStore === 'all' || sale.storeName === selectedStore;

      const matchesTime = selectedTime === 'all' || 
        (selectedTime === 'today' && sale.date === '2025-01-15') ||
        (selectedTime === 'week' && new Date(sale.date) >= new Date('2025-01-09')) ||
        (selectedTime === 'month' && new Date(sale.date) >= new Date('2025-01-01'));

      const matchesOrder = selectedOrder === 'all' || sale.status === selectedOrder;

      return matchesSearch && matchesStore && matchesTime && matchesOrder;
    });
  }, [searchQuery, selectedStore, selectedTime, selectedOrder, salesData]);

  const generatePDF = (sale: Sale) => {
    const storeInfo = sale.storeName === 'Tech Hub Gurgaon' 
      ? {
          name: 'Tech Hub Gurgaon',
          address: '456 Cyber City, Gurgaon, Haryana, 122002',
          contact: '+91-98765-43211',
          gstin: '06AABCU9603R1ZY'
        }
      : {
          name: 'Downtown Electronics',
          address: '123 Main Street, Downtown, Delhi, 110001',
          contact: '+91-98765-12345',
          gstin: '07AABCU9603R1ZX'
        };

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice - ${sale.billId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: left; margin-bottom: 30px; }
        .invoice-title { text-align: right; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .invoice-details { text-align: right; margin-bottom: 20px; }
        .divider { border-top: 2px solid #000; margin: 20px 0; }
        .bill-to { margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .total-section { text-align: right; margin-top: 20px; }
        .payment-info { margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        .status-delivered { color: #22c55e; font-weight: bold; }
        .status-pending { color: #ef4444; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2>${storeInfo.name}</h2>
        <p>${storeInfo.address}</p>
        <p>Contact: ${storeInfo.contact}</p>
        <p>GSTIN: ${storeInfo.gstin}</p>
    </div>
    
    <div class="invoice-title">Invoice</div>
    <div class="invoice-details">
        <p><strong>Bill # ${sale.billId}</strong></p>
        <p><strong>Order # ${sale.orderId}</strong></p>
        <p>Date: ${new Date(sale.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
    </div>
    
    <div class="divider"></div>
    
    <div style="display: flex; justify-content: space-between;">
        <div class="bill-to">
            <h3>Bill To:</h3>
            <p><strong>${sale.customerName}</strong></p>
            <p>${sale.phone}</p>
            <p>${sale.address}</p>
        </div>
        <div>
            <h3>Order Status:</h3>
            <p class="status-${sale.status}">${sale.status.toUpperCase()}</p>
        </div>
    </div>
    
    <table class="items-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${sale.itemDetails?.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.unitPrice.toFixed(2)}</td>
                    <td>₹${item.total.toFixed(2)}</td>
                </tr>
            `).join('') || `
                <tr>
                    <td>Product Item</td>
                    <td>${sale.items}</td>
                    <td>₹${(sale.amount / sale.items).toFixed(2)}</td>
                    <td>₹${sale.amount.toFixed(2)}</td>
                </tr>
            `}
        </tbody>
    </table>
    
    <div class="total-section">
        <p>Subtotal: ₹${sale.amount.toFixed(2)}</p>
        <h3>Total Amount: ₹${sale.amount.toFixed(2)}</h3>
    </div>
    
    <div class="payment-info">
        <p><strong>Payment Method:</strong> ${sale.paymentType}</p>
        ${sale.advance && sale.balance ? `
            <p><strong>Advance Paid:</strong> ₹${sale.advance}</p>
            <p><strong>Balance Due:</strong> ₹${sale.balance}</p>
        ` : ''}
    </div>
    
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated invoice.</p>
    </div>
</body>
</html>`;

    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${sale.billId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const addNewItem = () => {
    const newId = Math.max(...newSaleItems.map(item => item.id)) + 1;
    setNewSaleItems([...newSaleItems, { id: newId, name: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const updateItem = (id: number, field: keyof NewSaleItem, value: string | number) => {
    setNewSaleItems(items => 
      items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    if (newSaleItems.length > 1) {
      setNewSaleItems(items => items.filter(item => item.id !== id));
    }
  };

  const getTotalAmount = () => {
    return newSaleItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCreateSale = () => {
    // Here you would typically save the sale to your backend
    console.log('Creating new sale:', { ...newSaleForm, items: newSaleItems, totalAmount: getTotalAmount() });
    setShowNewSaleModal(false);
    // Reset form
    setNewSaleForm({
      store: '',
      orderId: '',
      saleDate: new Date().toISOString().split('T')[0],
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      paymentMethod: 'Cash (Full Payment)',
      orderStatus: 'Delivered'
    });
    setNewSaleItems([{ id: 1, name: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 overflow-y-auto"   style={{
    backgroundColor: '#EFF6FF',
    width: '100%',
  }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sales & Billing</h1>
            <p className="text-gray-600 text-lg">Manage your sales and generate professional bills</p>
          </div>
          <button 
            onClick={() => setShowNewSaleModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            New Sale
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg backdrop-blur-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
           <div className="relative md:flex-[1.5]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="name, phone, order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3  border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Store Filter */}
            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Stores</option>
                <option value="Downtown Electronics">Downtown Electronics</option>
                <option value="Tech Hub Gurgaon">Tech Hub Gurgaon</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Time Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Order Status Filter */}
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="all">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="pending">Pending Payment</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Sales History */}
        <div className="bg-white rounded-xl shadow-lg backdrop-blur-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <DollarSign size={22} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Sales History ({filteredSales.length} sales)
            </h2>
          </div>

          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <div
                key={sale.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:bg-white transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {sale.avatar}
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{sale.customerName}</h3>
                        <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded">
                          {sale.storeName}
                        </span>
                        {sale.status === 'pending' ? (
                          <span className="flex items-center gap-1 text-red-600 text-sm bg-red-50 px-3 py-1 rounded-full">
                            <Clock size={14} />
                            Pending Payment
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircle size={14} />
                            Delivered
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        Order #{sale.orderId} • Bill #{sale.billId}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          {sale.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {sale.address}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          {sale.paymentType}
                        </span>
                        <span className="text-xs text-gray-500">{sale.date}</span>
                      </div>

                      {sale.advance && sale.balance && (
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="text-green-600">Advance: ₹{sale.advance}</span>
                          <span className="text-red-600">Balance: ₹{sale.balance}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount and Actions */}
                <div className="flex items-center justify-end gap-6">
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                    ₹{sale.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                    {sale.items} {sale.items === 1 ? "item" : "items"}
                    </div>
                </div>
                <button 
                    onClick={() => generatePDF(sale)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 group-hover:scale-110 transform bg-gray-100 hover:bg-blue-100 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300"
                >
                    <Download size={16} />
                    PDF
                </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Sale Modal */}
        {showNewSaleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Create New Sale</h2>
                <button 
                  onClick={() => setShowNewSaleModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                    <select
                      value={newSaleForm.store}
                      onChange={(e) => setNewSaleForm({...newSaleForm, store: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select store</option>
                      <option value="Downtown Electronics">Downtown Electronics</option>
                      <option value="Tech Hub Gurgaon">Tech Hub Gurgaon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                    <input
                      type="text"
                      placeholder="Enter Order ID"
                      value={newSaleForm.orderId}
                      onChange={(e) => setNewSaleForm({...newSaleForm, orderId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sale Date</label>
                    <input
                      type="date"
                      value={newSaleForm.saleDate}
                      onChange={(e) => setNewSaleForm({...newSaleForm, saleDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      placeholder="Enter customer name"
                      value={newSaleForm.customerName}
                      onChange={(e) => setNewSaleForm({...newSaleForm, customerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={newSaleForm.customerPhone}
                      onChange={(e) => setNewSaleForm({...newSaleForm, customerPhone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Address</label>
                  <textarea
                    placeholder="Enter customer address"
                    value={newSaleForm.customerAddress}
                    onChange={(e) => setNewSaleForm({...newSaleForm, customerAddress: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Items Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Items</h3>
                    <button
                      onClick={addNewItem}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newSaleItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="col-span-5">
                          <input
                            type="text"
                            placeholder="Product name"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-right font-medium">
                            ₹{item.total.toFixed(2)}
                          </div>
                        </div>
                        <div className="col-span-1">
                          {newSaleItems.length > 1 && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      value={newSaleForm.paymentMethod}
                      onChange={(e) => setNewSaleForm({...newSaleForm, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Cash (Full Payment)">Cash (Full Payment)</option>
                      <option value="Partial Payment">Partial Payment</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                    <select
                      value={newSaleForm.orderStatus}
                      onChange={(e) => setNewSaleForm({...newSaleForm, orderStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Pending Payment">Pending Payment</option>
                    </select>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="text-right p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">
                    Total Amount: ₹{getTotalAmount().toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewSaleModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSale}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Save size={16} />
                  Create Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;