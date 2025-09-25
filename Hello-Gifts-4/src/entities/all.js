// src/Entities/all.js
import EmployeeData from "./Employee.json";
import StoreData from "./Store.json";
import PayrollData from "./Payroll.json";
import ExpenseData from "./Expense.json";
import ProductData from "./Product.json";
import SaleData from "./Sale.json";

export const Employee = {
  list: async () => EmployeeData,
};

export const Store = {
  list: async () => StoreData,
};

export const Payroll = {
  list: async () => PayrollData,
};
export const Expense = {
  list: async () => ExpenseData,
};
export const Product = {
  list: async () => ProductData,
};
export const Sale = {
  list: async () => SaleData,
};
