import  { useState } from 'react';
import { Plus, Users, CreditCard, FileText, Edit, Wallet, Mail, Phone, X,  ChevronDown, Download } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  joiningDate: string;
  basicSalary: number;
  allowances: number;
  status: 'Active' | 'Inactive';
  store: string;
}

interface PayrollData {
  month: string;
  basicSalary: number;
  allowances: number;
  overtimeHours: number;
  overtimeRate: number;
  otherDeductions: number;
  pfDeduction: number;
  taxDeduction: number;
  grossSalary: number;
  netSalary: number;
}

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    employeeId: 'EMP001',
    position: 'Sales Manager',
    department: 'Sales',
    email: 'rajesh@company.com',
    phone: '+91-99999-11111',
    address: 'N/A',
    joiningDate: '2023-01-15',
    basicSalary: 45000,
    allowances: 5000,
    status: 'Active',
    store: 'Main Store'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    employeeId: 'EMP002',
    position: 'Cashier',
    department: 'Operations',
    email: 'priya@company.com',
    phone: '+91-99999-22222',
    address: 'N/A',
    joiningDate: '2023-02-20',
    basicSalary: 25000,
    allowances: 3000,
    status: 'Active',
    store: 'Branch Store'
  },
  {
    id: '3',
    name: 'Vijay',
    employeeId: 'VJ01',
    position: 'Designer',
    department: 'in House',
    email: 'vijay@company.com',
    phone: '8019911168',
    address: 'Tech Hub Gurgaon',
    joiningDate: '2023-03-10',
    basicSalary: 12000,
    allowances: 0,
    status: 'Active',
    store: 'Corporate'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('Employee Directory');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showModal, setShowModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [payrollData, setPayrollData] = useState<PayrollData>({
    month: '2025-09',
    basicSalary: 0,
    allowances: 0,
    overtimeHours: 0,
    overtimeRate: 200,
    otherDeductions: 0,
    pfDeduction: 0,
    taxDeduction: 0,
    grossSalary: 0,
    netSalary: 0
  });
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    employeeId: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    address: '',
    joiningDate: '',
    basicSalary: 0,
    allowances: 0,
    status: 'Active',
    store: ''
  });

  const totalSalary = employees.reduce((sum, emp) => sum + emp.basicSalary + emp.allowances, 0);

  const openModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData(employee);
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        employeeId: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        address: '',
        joiningDate: new Date().toISOString().split('T')[0],
        basicSalary: 0,
        allowances: 0,
        status: 'Active',
        store: ''
      });
    }
    setShowModal(true);
  };

  const openPayrollModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    const pfDeduction = Math.round(employee.basicSalary * 0.12);
    const grossSalary = employee.basicSalary + employee.allowances;
    const netSalary = grossSalary - pfDeduction;
    
    setPayrollData({
      month: '2025-09',
      basicSalary: employee.basicSalary,
      allowances: employee.allowances,
      overtimeHours: 0,
      overtimeRate: 200,
      otherDeductions: 0,
      pfDeduction,
      taxDeduction: 0,
      grossSalary,
      netSalary
    });
    setShowPayrollModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowPayrollModal(false);
    setShowSuccessModal(false);
    setEditingEmployee(null);
    setSelectedEmployee(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayrollChange = (field: string, value: string | number) => {
    const updatedData = { ...payrollData, [field]: value };
    
    // Recalculate totals
    const overtimePay = updatedData.overtimeHours * updatedData.overtimeRate;
    const grossSalary = updatedData.basicSalary + updatedData.allowances + overtimePay;
    const totalDeductions = updatedData.pfDeduction + updatedData.taxDeduction + updatedData.otherDeductions;
    const netSalary = grossSalary - totalDeductions;
    
    updatedData.grossSalary = grossSalary;
    updatedData.netSalary = netSalary;
    
    setPayrollData(updatedData);
  };

  const handleSubmit = () => {
    if (editingEmployee) {
      setEmployees(prev => 
        prev.map(emp => emp.id === editingEmployee.id ? { ...emp, ...formData } as Employee : emp)
      );
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData as Employee
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    closeModal();
  };

  const generatePayroll = () => {
    setShowPayrollModal(false);
    setShowSuccessModal(true);
  };

  const downloadPayslip = async () => {
    if (!selectedEmployee) return;

    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('PAYSLIP', 105, 20, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.text(`Month: ${payrollData.month}`, 20, 35);
    pdf.text(`Employee: ${selectedEmployee.name}`, 20, 45);
    pdf.text(`Employee ID: ${selectedEmployee.employeeId}`, 20, 55);
    pdf.text(`Position: ${selectedEmployee.position}`, 20, 65);
    pdf.text(`Department: ${selectedEmployee.department}`, 20, 75);
    
    // Line separator
    pdf.setLineWidth(0.5);
    pdf.line(20, 85, 190, 85);
    
    // Earnings section
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('EARNINGS', 20, 100);
    pdf.text('DEDUCTIONS', 120, 100);
    
    // Earnings details
    let yPos = 115;
    pdf.text('Basic Salary:', 20, yPos);
    pdf.text(`₹${payrollData.basicSalary.toLocaleString()}`, 80, yPos);
    
    yPos += 10;
    pdf.text('Allowances:', 20, yPos);
    pdf.text(`₹${payrollData.allowances.toLocaleString()}`, 80, yPos);
    
    if (payrollData.overtimeHours > 0) {
      yPos += 10;
      pdf.text('Overtime Pay:', 20, yPos);
      pdf.text(`₹${(payrollData.overtimeHours * payrollData.overtimeRate).toLocaleString()}`, 80, yPos);
    }
    
    // Deductions details
    let deductionY = 115;
    pdf.text('PF Deduction (12%):', 120, deductionY);
    pdf.text(`₹${payrollData.pfDeduction.toLocaleString()}`, 170, deductionY);
    
    if (payrollData.taxDeduction > 0) {
      deductionY += 10;
      pdf.text('Tax Deduction:', 120, deductionY);
      pdf.text(`₹${payrollData.taxDeduction.toLocaleString()}`, 170, deductionY);
    }
    
    if (payrollData.otherDeductions > 0) {
      deductionY += 10;
      pdf.text('Other Deductions:', 120, deductionY);
      pdf.text(`₹${payrollData.otherDeductions.toLocaleString()}`, 170, deductionY);
    }
    
    // Summary section
    pdf.setLineWidth(0.5);
    pdf.line(20, 160, 190, 160);
    
    pdf.setFontSize(14);
    pdf.text('SUMMARY', 20, 175);
    
    pdf.setFontSize(12);
    pdf.text('Gross Salary:', 20, 190);
    pdf.text(`₹${payrollData.grossSalary.toLocaleString()}`, 80, 190);
    
    pdf.text('Total Deductions:', 20, 205);
    pdf.text(`₹${(payrollData.pfDeduction + payrollData.taxDeduction + payrollData.otherDeductions).toLocaleString()}`, 80, 205);
    
    // Net salary highlight
    pdf.setFillColor(220, 255, 220);
    pdf.rect(15, 215, 180, 15, 'F');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 128, 0);
    pdf.text('NET SALARY:', 20, 225);
    pdf.text(`₹${payrollData.netSalary.toLocaleString()}`, 80, 225);
    
    // Footer
    pdf.setTextColor(128, 128, 128);
    pdf.setFontSize(10);
    pdf.text('This is a computer generated payslip and does not require signature.', 105, 260, { align: 'center' });
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 270, { align: 'center' });
    
    // Save PDF
    pdf.save(`${selectedEmployee.name}_Payslip_${payrollData.month}.pdf`);
    
    // Close modal after a short delay to ensure download starts
    setTimeout(() => {
      closeModal();
    }, 500);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-cyan-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payroll Management</h1>
            <p className="text-gray-600">Manage employees and generate payroll</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-2">Active Employees</h3>
                <p className="text-3xl font-bold">{employees.filter(emp => emp.status === 'Active').length}</p>
              </div>
              <Users size={36} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-2">Monthly Salary Budget</h3>
                <p className="text-3xl font-bold">₹{totalSalary.toLocaleString()}</p>
              </div>
              <CreditCard size={36} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-2">Payrolls Processed</h3>
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm opacity-90 mt-1">This month</p>
              </div>
              <FileText size={36} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('Employee Directory')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'Employee Directory'
                ? 'bg-white text-blue-600 shadow-md border border-blue-100'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Employee Directory
          </button>
          <button
            onClick={() => setActiveTab('Payroll Records')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'Payroll Records'
                ? 'bg-white  text-blue-600 shadow-md border border-blue-100'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Payroll Records
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm w-full">
          {activeTab === 'Employee Directory' ? (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <Users className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Employee Directory ({employees.length} employees)
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {employees.map((employee, index) => (
                  <div
                    key={employee.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-bold`}>
                          {getInitials(employee.name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
                          <p className="text-gray-500 text-sm">#{employee.employeeId}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {employee.status.toLowerCase()}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-blue-600 font-medium">{employee.position}</p>
                      <p className="text-gray-600">{employee.department}</p>
                      <p className="text-gray-500 text-sm">{employee.address}</p>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span>{employee.phone}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Basic Salary:</span>
                        <span className="font-semibold">₹{employee.basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Allowances:</span>
                        <span className="font-semibold text-green-600">₹{employee.allowances.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(employee)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={() => openPayrollModal(employee)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Wallet size={16} />
                        Payroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] "   style={{width: '100%'}}>
              <div className="w-24 h-24 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payroll Records</h3>
              <p className="text-gray-500">Payroll history will appear here once generated</p>
            </div>
          )}
        </div>
      </div>

      {/* Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  value={formData.employeeId || ''}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Store, Position, Department in single row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                <div className="relative">
                  <select
                    value={formData.store || ''}
                    onChange={(e) => handleInputChange('store', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select a store</option>
                    <option value="Main Store">Main Store</option>
                    <option value="Branch Store">Branch Store</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
                <input
                  type="date"
                  value={formData.joiningDate || ''}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (₹)</label>
                <input
                  type="number"
                  value={formData.basicSalary || 0}
                  onChange={(e) => handleInputChange('basicSalary', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allowances (₹)</label>
                <input
                  type="number"
                  value={formData.allowances || 0}
                  onChange={(e) => handleInputChange('allowances', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Users size={20} />
                {editingEmployee ? 'Update Employee' : 'Save Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Generation Modal */}
      {showPayrollModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Generate Payroll - {selectedEmployee.name}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <input
                  type="text"
                  value={payrollData.month}
                  onChange={(e) => handlePayrollChange('month', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary (₹)</label>
                <input
                  type="number"
                  value={payrollData.basicSalary}
                  onChange={(e) => handlePayrollChange('basicSalary', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allowances (₹)</label>
                <input
                  type="number"
                  value={payrollData.allowances}
                  onChange={(e) => handlePayrollChange('allowances', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Hours</label>
                <input
                  type="number"
                  value={payrollData.overtimeHours}
                  onChange={(e) => handlePayrollChange('overtimeHours', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Rate (₹/hour)</label>
                <input
                  type="number"
                  value={payrollData.overtimeRate}
                  onChange={(e) => handlePayrollChange('overtimeRate', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Deductions (₹)</label>
                <input
                  type="number"
                  value={payrollData.otherDeductions}
                  onChange={(e) => handlePayrollChange('otherDeductions', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payroll Summary */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payroll Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary:</span>
                    <span className="font-semibold">₹{payrollData.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allowances:</span>
                    <span className="font-semibold">₹{payrollData.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overtime Pay:</span>
                    <span className="font-semibold">₹{(payrollData.overtimeHours * payrollData.overtimeRate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Gross Salary:</span>
                    <span>₹{payrollData.grossSalary.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-red-600">
                    <span>PF Deduction (12%):</span>
                    <span>₹{payrollData.pfDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Tax Deduction:</span>
                    <span>₹{payrollData.taxDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Other Deductions:</span>
                    <span>₹{payrollData.otherDeductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-green-600 border-t pt-2">
                    <span>Net Salary:</span>
                    <span>₹{payrollData.netSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generatePayroll}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Payroll Generated Successfully!</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} className="text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-green-600 mb-2">Payroll Generated!</h3>
              <p className="text-gray-600 mb-6">
                Payroll for {selectedEmployee.name} has been successfully generated for September 2025.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={downloadPayslip}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} />
                  Download Payslip
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;