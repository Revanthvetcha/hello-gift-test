import React, { useState, useEffect } from 'react';
import { Payroll } from '@/entities/Payroll';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Download } from "lucide-react";
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import PayslipPDF from './PayslipPDF';

export default function PayrollForm({ employee, onClose, onSuccess }) {
  const [payrollData, setPayrollData] = useState({
    month: format(new Date(), 'yyyy-MM'),
    basic_salary: employee.basic_salary,
    allowances: employee.allowances || 0,
    overtime_hours: 0,
    overtime_rate: 200,
    deductions: 0,
    pf_deduction: 0,
    tax_deduction: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPayroll, setGeneratedPayroll] = useState(null);

  const calculatePayroll = () => {
    const basicSalary = parseFloat(payrollData.basic_salary) || 0;
    const allowances = parseFloat(payrollData.allowances) || 0;
    const overtimePay = (parseFloat(payrollData.overtime_hours) || 0) * (parseFloat(payrollData.overtime_rate) || 0);
    const grossSalary = basicSalary + allowances + overtimePay;
    
    const pfDeduction = grossSalary * 0.12; // 12% PF
    const taxDeduction = grossSalary > 50000 ? grossSalary * 0.1 : 0; // 10% tax if > 50k
    const totalDeductions = pfDeduction + taxDeduction + (parseFloat(payrollData.deductions) || 0);
    
    const netSalary = grossSalary - totalDeductions;
    
    return {
      gross_salary: grossSalary,
      pf_deduction: pfDeduction,
      tax_deduction: taxDeduction,
      total_deductions: totalDeductions,
      net_salary: netSalary
    };
  };

  const calculated = calculatePayroll();

  const handleInputChange = (field, value) => {
    setPayrollData({ ...payrollData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const finalData = {
        employee_id: employee.id,
        ...payrollData,
        ...calculated,
        basic_salary: parseFloat(payrollData.basic_salary) || 0,
        allowances: parseFloat(payrollData.allowances) || 0,
        overtime_hours: parseFloat(payrollData.overtime_hours) || 0,
        overtime_rate: parseFloat(payrollData.overtime_rate) || 0,
        deductions: parseFloat(payrollData.deductions) || 0
      };
      
      const createdPayroll = await Payroll.create(finalData);
      setGeneratedPayroll({ ...finalData, employee, id: createdPayroll.id });
      
    } catch (error) {
      console.error("Error generating payroll:", error);
    }
    setIsSubmitting(false);
  };

  const handleDownloadPayslip = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleComplete = () => {
    onSuccess();
  };

  // Print effect
  useEffect(() => {
    if (generatedPayroll) {
      // Auto-trigger print dialog after showing success
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [generatedPayroll]);

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 print:hidden"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="max-w-3xl w-full"
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card className="bg-white shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {generatedPayroll ? 'Payroll Generated Successfully!' : `Generate Payroll - ${employee.employee_name}`}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {!generatedPayroll ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="month">Month</Label>
                      <Input 
                        id="month" 
                        type="month"
                        value={payrollData.month} 
                        onChange={(e) => handleInputChange('month', e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="basic_salary">Basic Salary (₹)</Label>
                      <Input 
                        id="basic_salary" 
                        type="number"
                        value={payrollData.basic_salary} 
                        onChange={(e) => handleInputChange('basic_salary', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="allowances">Allowances (₹)</Label>
                      <Input 
                        id="allowances" 
                        type="number"
                        value={payrollData.allowances} 
                        onChange={(e) => handleInputChange('allowances', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="overtime_hours">Overtime Hours</Label>
                      <Input 
                        id="overtime_hours" 
                        type="number"
                        value={payrollData.overtime_hours} 
                        onChange={(e) => handleInputChange('overtime_hours', e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="overtime_rate">Overtime Rate (₹/hour)</Label>
                      <Input 
                        id="overtime_rate" 
                        type="number"
                        value={payrollData.overtime_rate} 
                        onChange={(e) => handleInputChange('overtime_rate', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deductions">Other Deductions (₹)</Label>
                      <Input 
                        id="deductions" 
                        type="number"
                        value={payrollData.deductions} 
                        onChange={(e) => handleInputChange('deductions', e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Calculation Summary */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Payroll Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Basic Salary:</span>
                          <span>₹{payrollData.basic_salary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Allowances:</span>
                          <span>₹{payrollData.allowances}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overtime Pay:</span>
                          <span>₹{(payrollData.overtime_hours * payrollData.overtime_rate).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Gross Salary:</span>
                          <span>₹{calculated.gross_salary.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-red-600">
                          <span>PF Deduction (12%):</span>
                          <span>₹{calculated.pf_deduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Tax Deduction:</span>
                          <span>₹{calculated.tax_deduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Other Deductions:</span>
                          <span>₹{payrollData.deductions}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2 text-green-600 text-lg">
                          <span>Net Salary:</span>
                          <span>₹{calculated.net_salary.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-500 to-green-600"
                    >
                      {isSubmitting ? 'Generating...' : 'Generate Payroll'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">Payroll Generated!</h3>
                  <p className="text-slate-600 mb-6">
                    Payroll for {employee.employee_name} has been successfully generated for {format(new Date(payrollData.month), 'MMMM yyyy')}.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={handleDownloadPayslip}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Payslip
                    </Button>
                    <Button onClick={handleComplete} variant="outline">
                      Complete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Hidden PDF for printing */}
      {generatedPayroll && (
        <div className="hidden print:block">
          <PayslipPDF payroll={generatedPayroll} employee={employee} />
        </div>
      )}
    </>
  );
}