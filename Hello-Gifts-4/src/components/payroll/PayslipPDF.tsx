
import React from 'react';
import { format } from "date-fns";
import { IndianRupee } from 'lucide-react';

export default function PayslipPDF({ employee, payroll, store }) {
  if (!employee || !payroll || !store) return null;

  return (
    <div className="p-8 bg-white font-sans">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>
      
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b-2 border-slate-800 mb-6">
        <div className="flex items-center gap-4">
            {store.logo_url && <img src={store.logo_url} alt="Store Logo" className="w-24 h-24 object-contain" />}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{store.store_name}</h1>
                <p className="text-slate-600">{store.address}</p>
            </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-blue-800 uppercase">Payslip</h2>
          <p>For the month of {format(new Date(payroll.month), 'MMMM yyyy')}</p>
        </div>
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold uppercase text-slate-500 mb-3">Employee Details</h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {employee.employee_name}</p>
            <p><span className="font-semibold">Employee ID:</span> {employee.employee_id}</p>
            <p><span className="font-semibold">Position:</span> {employee.position}</p>
            <p><span className="font-semibold">Department:</span> {employee.department}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase text-slate-500 mb-3">Pay Period</h3>
          <div className="space-y-2">
            <p><span className="font-semibold">Month:</span> {format(new Date(payroll.month), 'MMMM yyyy')}</p>
            <p><span className="font-semibold">Generated On:</span> {format(new Date(), 'PPP')}</p>
          </div>
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="bg-green-800 text-white font-semibold uppercase text-sm py-2 px-4 rounded-t-lg">
            Earnings
          </div>
          <div className="border-x border-b border-slate-200 bg-white">
            <div className="flex justify-between py-2 px-4 border-b">
              <span>Basic Salary</span>
              <span className="flex items-center"><IndianRupee className="w-3 h-3"/>{payroll.basic_salary.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 px-4 border-b">
              <span>Allowances</span>
              <span className="flex items-center"><IndianRupee className="w-3 h-3"/>{payroll.allowances.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 px-4 border-b">
              <span>Overtime Pay</span>
              <span className="flex items-center"><IndianRupee className="w-3 h-3"/>{((payroll.overtime_hours || 0) * (payroll.overtime_rate || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 px-4 bg-green-100 font-bold">
              <span>Gross Salary</span>
              <span className="flex items-center"><IndianRupee className="w-4 h-4"/>{payroll.gross_salary.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-red-800 text-white font-semibold uppercase text-sm py-2 px-4 rounded-t-lg">
            Deductions
          </div>
          <div className="border-x border-b border-slate-200 bg-white">
            <div className="flex justify-between py-2 px-4 border-b">
              <span>Provident Fund (PF)</span>
              <span className="flex items-center"><IndianRupee className="w-3 h-3"/>{payroll.pf_deduction.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 px-4 border-b">
              <span>Tax Deduction</span>
              <span className="flex items-center"><IndianRupee className="w-3 h-3"/>{payroll.tax_deduction.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 px-4 border-b">
              <span>Other Deductions</span>
              <span className="flex items-center"><IndianRupee className="w-3 h-3"/>{(payroll.deductions || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 px-4 bg-red-100 font-bold">
              <span>Total Deductions</span>
              <span className="flex items-center"><IndianRupee className="w-4 h-4"/>{(payroll.pf_deduction + payroll.tax_deduction + (payroll.deductions || 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="bg-slate-800 text-white p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-slate-300 mb-1">Net Salary</p>
            <p className="text-3xl font-bold flex items-center">
              <IndianRupee className="w-8 h-8" />
              {payroll.net_salary.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm border-t pt-4">
        <p>This is a computer-generated payslip and does not require a signature.</p>
        <p className="mt-2">For any queries, please contact HR Department</p>
      </div>
    </div>
  );
}
