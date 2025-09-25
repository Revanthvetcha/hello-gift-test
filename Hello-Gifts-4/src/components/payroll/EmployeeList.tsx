import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Pencil, CreditCard, Mail, Phone, IndianRupee } from "lucide-react";
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function EmployeeList({ employees, stores, isLoading, onEdit, onGeneratePayroll }) {
  const getStoreName = (storeId) => stores.find(s => s.id === storeId)?.store_name || "N/A";

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 h-48 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Employee Directory ({employees.length} employees)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {employee.employee_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {employee.employee_name}
                    </h3>
                    <p className="text-sm text-slate-500">#{employee.employee_id}</p>
                  </div>
                </div>
                <Badge className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {employee.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <p className="font-semibold text-blue-600">{employee.position}</p>
                <p className="text-slate-600">{employee.department}</p>
                <p className="text-slate-500">{getStoreName(employee.store_id)}</p>
                
                {employee.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3 h-3" />
                    <span className="text-xs">{employee.email}</span>
                  </div>
                )}
                
                {employee.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3 h-3" />
                    <span className="text-xs">{employee.phone}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">Basic Salary:</span>
                  <span className="font-bold text-slate-900 flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {employee.basic_salary.toLocaleString('en-IN')}
                  </span>
                </div>
                {employee.allowances > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Allowances:</span>
                    <span className="font-semibold text-green-600 flex items-center">
                      <IndianRupee className="w-3 h-3" />
                      {employee.allowances.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}
                  className="flex-1"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onGeneratePayroll(employee)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Payroll
                </Button>
              </div>
            </motion.div>
          ))}

          {employees.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No employees found</h3>
              <p className="text-slate-500">Add your first employee to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}