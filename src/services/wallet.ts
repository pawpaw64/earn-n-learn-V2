
import axios from 'axios';
import { setAuthToken } from './auth';

const API_URL = 'http://localhost:8080/api';

export interface WalletDetails {
  balance: number;
  pendingEscrow: number;
  monthlyEarnings: number;
  monthlySpending: number;
  savingsProgress: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'escrow' | 'payment' | 'release';
  status: 'completed' | 'pending' | 'failed';
}

export interface PaymentMethod {
  id: number;
  type: string;
  provider: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  progress: number;
}

export interface EscrowTransaction {
  id: string;
  title: string;
  jobType: string;
  amount: number;
  status: string;
  clientName: string;
  clientEmail: string;
  providerName: string;
  providerEmail: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  isProvider: boolean;
}

export interface FinancialData {
  monthlyData: Array<{
    name: string;
    income: number;
    expenses: number;
  }>;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}

export interface ExpenseBreakdown {
  name: string;
  value: number;
}

export const getFinancialData = async (timeframe: string): Promise<FinancialData> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/wallet/financial-data?timeframe=${timeframe}`);
  return response.data;
};

export const getExpenseBreakdown = async (timeframe: string): Promise<ExpenseBreakdown[]> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/wallet/expense-breakdown?timeframe=${timeframe}`);
  return response.data;
};

export const getWalletDetails = async (): Promise<WalletDetails> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/wallet/details`);
  return response.data;
};

export const topUpWallet = async (amount: number, paymentMethod: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/wallet/topup`, { amount, paymentMethod });
  return response.data;
};

export const withdrawFromWallet = async (amount: number, withdrawMethod: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/wallet/withdraw`, { amount, withdrawMethod });
  return response.data;
};

export const getTransactions = async (filter?: string): Promise<Transaction[]> => {
  setAuthToken(localStorage.getItem('token'));
  const url = filter && filter !== 'all' ? `${API_URL}/wallet/transactions?filter=${filter}` : `${API_URL}/wallet/transactions`;
  const response = await axios.get(url);
  return response.data;
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/wallet/payment-methods`);
  return response.data;
};

export const addPaymentMethod = async (data: Partial<PaymentMethod>): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/wallet/payment-methods`, data);
  return response.data;
};

export const setDefaultPaymentMethod = async (methodId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/wallet/payment-methods/${methodId}/default`);
  return response.data;
};

export const deletePaymentMethod = async (methodId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/wallet/payment-methods/${methodId}`);
  return response.data;
};

export const getSavingsGoals = async (): Promise<SavingsGoal[]> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/wallet/savings-goals`);
  return response.data;
};

export const addSavingsGoal = async (data: {
  name: string;
  targetAmount: number;
  deadline?: string;
}): Promise<any> => {  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/wallet/savings-goals`, data);
  return response.data;
};

export const updateSavingsGoal = async (goalId: number, amount: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
 const response = await axios.put(`${API_URL}/wallet/savings-goals/${goalId}/add-funds`, { amount });
  return response.data;
};
export const editSavingsGoal = async (goalId: number, data: {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.put(`${API_URL}/wallet/savings-goals/${goalId}`, data);
  return response.data;
};
export const deleteSavingsGoal = async (goalId: number): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.delete(`${API_URL}/wallet/savings-goals/${goalId}`);
  return response.data;
};
export const getEscrowTransactions = async (): Promise<EscrowTransaction[]> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.get(`${API_URL}/wallet/escrow`);
  return response.data;
};

export const createEscrowTransaction = async (data: any): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/wallet/escrow`, data);
  return response.data;
};

export const releaseEscrowFunds = async (transactionId: string): Promise<any> => {
  setAuthToken(localStorage.getItem('token'));
  const response = await axios.post(`${API_URL}/wallet/escrow/${transactionId}/release`);
  return response.data;
};
