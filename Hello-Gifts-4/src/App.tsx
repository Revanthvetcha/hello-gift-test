// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components2/Sidebar';
import { MainContent } from './components2/MainContent';
import Stores from './components2/Stores';
import Inventory from './components2/Inventory';
import Sales from './components2/Sales';
import Payroll from './components2/Payroll';
import Expenses from './components2/expenses/Expenses'; 
import Reports from './components2/reports/Reports'; 

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <Routes>
          <Route path="/" element={<MainContent activeSection="dashboard" />} />
          <Route path="/dashboard" element={<MainContent activeSection="dashboard" />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/expenses" element={<Expenses />} /> {/* ✅ fixed */}
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
