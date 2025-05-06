// src/api/invoices.ts
import axios from 'axios';
import { InvoiceType } from '@/types/marketplace';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export const fetchInvoices = async (): Promise<InvoiceType[]> => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/invoices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

export const createInvoice = async (invoiceData: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/invoices`, invoiceData);
  return response.data;
};

export const updateInvoiceStatus = async (id: number, status: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/invoices/${id}/status`, { status });
  return response.data;
};

export const getInvoiceDetails = async (id: number): Promise<InvoiceType> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/invoices/${id}`);
  return response.data;
};

export const fetchMyInvoices = async () => {
  setAuthToken(localStorage.getItem('token'));
  try {
    const response = await axios.get(`${API_URL}/invoices`);
    
    const invoices = response.data.map((invoice: InvoiceType) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      title: invoice.title,
      client: invoice.client,
      amount: `$${invoice.amount}`,
      date: new Date(invoice.issued_date).toLocaleDateString(),
      status: invoice.status,
      dueDate: new Date(invoice.due_date).toLocaleDateString()
    }));
    
    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};