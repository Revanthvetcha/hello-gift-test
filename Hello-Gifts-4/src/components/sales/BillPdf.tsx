
import React from "react";
import { format } from "date-fns";

export default function BillPDF({ sale, store }) {
  React.useEffect(() => {
    const generatePDF = () => {
      if (!sale || !store) return;
      
      const printWindow = window.open('', '_blank');
      const pdfContent = document.getElementById('bill-pdf-content').innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bill - ${sale.bill_number}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: white;
              }
              .print-content { max-width: 800px; margin: 0 auto; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-2xl { font-size: 1.5rem; }
              .text-xl { font-size: 1.25rem; }
              .font-bold { font-weight: bold; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .border-b-2 { border-bottom: 2px solid #000; }
              .pb-4 { padding-bottom: 1rem; }
              .grid-cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
            </style>
          </head>
          <body>
            <div class="print-content">
              ${pdfContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    };
    generatePDF();
  }, [sale, store]); // Dependencies are now sale and store

  if (!sale || !store) return null;

  return (
    <div id="bill-pdf-content" className="p-8 bg-white font-sans" style={{ display: 'none' }}>
      {/* Header */}
      <div className="flex justify-between items-start pb-4 border-b-2 border-slate-800 mb-6">
        <div className="flex items-center gap-4">
          {store.logo_url && <img src={store.logo_url} alt="Store Logo" className="w-24 h-24 object-contain" />}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{store.store_name}</h1>
            <p className="text-slate-600">{store.address}</p>
            <p className="text-slate-600">Contact: {store.contact_number}</p>
            {store.gstin && <p className="text-slate-600 font-bold">GSTIN: {store.gstin}</p>}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-blue-800 uppercase">Invoice</h2>
          <p className="font-bold">Bill # {sale.bill_number}</p>
          <p className="font-bold">Order # {sale.order_id}</p>
          <p>Date: {format(new Date(sale.sale_date), 'MMM d, yyyy')}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid-cols-2 mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Bill To:</h3>
          <p className="text-lg font-bold">{sale.customer_name}</p>
          <p>{sale.customer_address}</p>
          <p>{sale.customer_phone}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Order Status:</h3>
          <p className="font-bold" style={{color: sale.order_status === 'delivered' ? '#10b981' : '#ef4444'}}>
            {sale.order_status === 'delivered' ? 'DELIVERED' : 'PENDING PAYMENT'}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr style={{backgroundColor: '#1f2937', color: 'white'}}>
            <th style={{padding: '12px'}}>Description</th>
            <th style={{padding: '12px', textAlign: 'right'}}>Qty</th>
            <th style={{padding: '12px', textAlign: 'right'}}>Unit Price</th>
            <th style={{padding: '12px', textAlign: 'right'}}>Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, index) => (
            <tr key={index}>
              <td style={{padding: '12px', fontWeight: 'bold'}}>{item.product_name}</td>
              <td style={{padding: '12px', textAlign: 'right'}}>{item.quantity}</td>
              <td style={{padding: '12px', textAlign: 'right'}}>₹{item.unit_price.toFixed(2)}</td>
              <td style={{padding: '12px', textAlign: 'right', fontWeight: 'bold'}}>₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment Summary */}
      <div className="text-right mb-6">
        <div style={{display: 'inline-block', minWidth: '300px'}}>
          <div className="flex justify-between py-2" style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ddd'}}>
            <span>Subtotal:</span>
            <span className="font-bold">₹{sale.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-xl" style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', backgroundColor: '#1f2937', color: 'white', marginTop: '8px'}}>
            <span style={{padding: '0 16px'}}>Total Amount:</span>
            <span style={{padding: '0 16px'}}>₹{sale.total_amount.toFixed(2)}</span>
          </div>

          {sale.payment_method === 'partial_payment' && (
            <div style={{marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '8px'}}>
              <div className="flex justify-between" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                <span>Advance Paid:</span>
                <span style={{color: '#10b981', fontWeight: 'bold'}}>₹{sale.advance_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Balance Due:</span>
                <span style={{color: '#ef4444', fontWeight: 'bold'}}>₹{sale.balance_amount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <p><strong>Payment Method:</strong> {
          sale.payment_method === 'cash' ? 'Cash Payment' :
          sale.payment_method === 'online_upi' ? 'Online UPI Payment' :
          'Partial Payment (Advance)'
        }</p>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm border-t pt-4">
        <p>Thank you for your business!</p>
        <p>This is a computer-generated invoice.</p>
      </div>
    </div>
  );
}
