
import React, { useState, useEffect } from 'react';
import { Employee, Store } from '@/entities/all';
import { Payroll as PayrollEntity } from '@/entities/Payroll.json';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'date-fns';

import EmployeeForm from '../components/payroll/EmployeeForm';
import EmployeeList from '../components/payroll/EmployeeList';
import PayrollForm from '../components/payroll/PayrollForm';

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('employees');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployeeForPayroll, setSelectedEmployeeForPayroll] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [employeesData, payrollsData, storesData] = await Promise.all([
        Employee.list(),
        PayrollEntity.list(), // Changed from Payroll.list()
        Store.list()
      ]);
      setEmployees(employeesData);
      setPayrolls(payrollsData);
      setStores(storesData);
    } catch (error) {
      console.error("Error loading payroll data:", error);
    }
    setIsLoading(false);
  };

  const handleEmployeeFormClose = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
  };

  const handlePayrollFormClose = () => {
    setShowPayrollForm(false);
    setSelectedEmployeeForPayroll(null);
  };

  const handleFormSuccess = () => {
    loadData();
    handleEmployeeFormClose();
    handlePayrollFormClose();
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleGeneratePayroll = (employee) => {
    setSelectedEmployeeForPayroll(employee);
    setShowPayrollForm(true);
  };

  const totalSalaryBudget = employees.reduce((sum, emp) => sum + emp.basic_salary + (emp.allowances || 0), 0);
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthlyPayrollProcessed = payrolls.filter(p => p.month === currentMonth).length;

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Payroll Management
            </h1>
            <p className="text-slate-600 mt-1">Manage employees and generate payroll</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Button
              onClick={() => setShowEmployeeForm(true)}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </motion.div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Active Employees</p>
                  <p className="text-3xl font-bold">{activeEmployees}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Monthly Salary Budget</p>
                  <p className="text-2xl font-bold">₹{totalSalaryBudget.toLocaleString('en-IN')}</p>
                </div>
                <CreditCard className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Payrolls Processed</p>
                  <p className="text-3xl font-bold">{monthlyPayrollProcessed}</p>
                  <p className="text-xs text-orange-200">This month</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'employees'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Employee Directory
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'payroll'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Payroll Records
            </button>
          </div>
        </div>

        {/* Forms */}
        <AnimatePresence>
          {showEmployeeForm && (
            <EmployeeForm
              employee={editingEmployee}
              stores={stores}
              onClose={handleEmployeeFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
          
          {showPayrollForm && selectedEmployeeForPayroll && (
            <PayrollForm
              employee={selectedEmployeeForPayroll}
              onClose={handlePayrollFormClose}
              onSuccess={handleFormSuccess}
            />
          )}
        </AnimatePresence>

        {/* Content */}
        {activeTab === 'employees' && (
          <EmployeeList
            employees={employees}
            stores={stores}
            isLoading={isLoading}
            onEdit={handleEditEmployee}
            onGeneratePayroll={handleGeneratePayroll}
          />
        )}

        {activeTab === 'payroll' && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Payroll Records</h3>
              <p className="text-slate-500">Payroll history will appear here once generated</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
