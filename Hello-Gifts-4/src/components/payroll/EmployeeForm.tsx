import React, { useState } from 'react';
import { Employee } from '@/entities/Employee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Save } from "lucide-react";
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function EmployeeForm({ employee, stores, onClose, onSuccess }) {
  const [formData, setFormData] = useState(employee || {
    store_id: '',
    employee_name: '',
    employee_id: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    address: '',
    joining_date: format(new Date(), 'yyyy-MM-dd'),
    basic_salary: 0,
    allowances: 0,
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        basic_salary: parseFloat(formData.basic_salary) || 0,
        allowances: parseFloat(formData.allowances) || 0
      };
      
      if (employee) {
        await Employee.update(employee.id, dataToSave);
      } else {
        await Employee.create(dataToSave);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_name">Full Name</Label>
                  <Input 
                    id="employee_name" 
                    value={formData.employee_name} 
                    onChange={(e) => handleInputChange('employee_name', e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input 
                    id="employee_id" 
                    value={formData.employee_id} 
                    onChange={(e) => handleInputChange('employee_id', e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="store_id">Store</Label>
                  <Select value={formData.store_id} onValueChange={(val) => handleInputChange('store_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.store_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input 
                    id="position" 
                    value={formData.position} 
                    onChange={(e) => handleInputChange('position', e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    value={formData.department} 
                    onChange={(e) => handleInputChange('department', e.target.value)} 
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  value={formData.address} 
                  onChange={(e) => handleInputChange('address', e.target.value)} 
                  rows={2}
                />
              </div>

              {/* Employment Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="joining_date">Joining Date</Label>
                  <Input 
                    id="joining_date" 
                    type="date"
                    value={formData.joining_date} 
                    onChange={(e) => handleInputChange('joining_date', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="basic_salary">Basic Salary (₹)</Label>
                  <Input 
                    id="basic_salary" 
                    type="number"
                    value={formData.basic_salary} 
                    onChange={(e) => handleInputChange('basic_salary', e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allowances">Allowances (₹)</Label>
                  <Input 
                    id="allowances" 
                    type="number"
                    value={formData.allowances} 
                    onChange={(e) => handleInputChange('allowances', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(val) => handleInputChange('status', val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-orange-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Employee'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}