export interface ExpenseData {
  id: string;
  name: string;
  category: string;
  store: string;
  amount: number;
  date: string;
}

export function generateExpensePDF(expenses: ExpenseData[]) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Expense Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #fff;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #333;
          padding-bottom: 20px;
        }
        
        .header h1 {
          font-size: 32px;
          margin: 0 0 10px 0;
          color: #2d3748;
        }
        
        .header .date {
          color: #666;
          font-size: 16px;
        }
        
        .summary {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .summary h2 {
          margin: 0 0 15px 0;
          font-size: 24px;
        }
        
        .total-amount {
          font-size: 28px;
          color: #e53e3e;
          font-weight: bold;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        th {
          background: #f7fafc;
          font-weight: 600;
          color: #2d3748;
        }
        
        .amount {
          font-weight: 600;
          color: #2d3748;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-style: italic;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Expense Report</h1>
        <div class="date">Generated on ${currentDate}</div>
      </div>
      
      <div class="summary">
        <h2>Summary</h2>
        <div style="text-align: right;">
          <span style="color: #666; margin-right: 10px;">Total Expenses</span>
          <span class="total-amount">₹ ${totalAmount.toLocaleString()}</span>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th>STORE</th>
            <th>EXPENSE</th>
            <th>CATEGORY</th>
            <th style="text-align: right;">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          ${expenses.map(expense => `
            <tr>
              <td>${new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              <td>${expense.store}</td>
              <td>${expense.name}</td>
              <td>${expense.category}</td>
              <td class="amount" style="text-align: right;">₹ ${expense.amount.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        This is a computer-generated expense report.
      </div>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `expense-report-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}