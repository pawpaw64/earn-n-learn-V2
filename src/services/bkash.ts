
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/bkash';

// Get authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Create bKash payment
export const createBkashPayment = async (amount: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-payment`,
      { amount },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Create bKash payment error:', error);
    throw error;
  }
};

// Execute bKash payment
export const executeBkashPayment = async (paymentID: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/execute-payment`,
      { paymentID },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Execute bKash payment error:', error);
    throw error;
  }
};

// Query payment status
export const queryBkashPayment = async (paymentID: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/query-payment/${paymentID}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Query bKash payment error:', error);
    throw error;
  }
};

// Get user bKash transactions
export const getBkashTransactions = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Get bKash transactions error:', error);
    throw error;
  }
};

// Add bKash account
export const addBkashAccount = async (accountData: {
  accountNumber: string;
  accountHolderName?: string;
  isDefault?: boolean;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/accounts`,
      accountData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Add bKash account error:', error);
    throw error;
  }
};

// Get user bKash accounts
export const getBkashAccounts = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/accounts`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Get bKash accounts error:', error);
    throw error;
  }
};

// Update account default status
export const updateBkashAccountDefault = async (accountId: number) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/accounts/${accountId}/default`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Update bKash account default error:', error);
    throw error;
  }
};

// Delete bKash account
export const deleteBkashAccount = async (accountId: number) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/accounts/${accountId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Delete bKash account error:', error);
    throw error;
  }
};

// bKash checkout integration helper
export const initBkashCheckout = (paymentData: any) => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).bKash) {
      const bKash = (window as any).bKash;
      
      bKash.init({
        paymentMode: 'checkout',
        paymentRequest: paymentData,
        
        createRequest: async function(request: any) {
          try {
            const response = await createBkashPayment(request.amount);
            if (response.success) {
              bKash.create().onSuccess(response);
            } else {
              bKash.create().onError();
              reject(new Error(response.error || 'Payment creation failed'));
            }
          } catch (error) {
            bKash.create().onError();
            reject(error);
          }
        },
        
        executeRequestOnAuthorization: async function() {
          try {
            const response = await executeBkashPayment(paymentData.paymentID);
            if (response.success) {
              resolve(response);
            } else {
              bKash.execute().onError();
              reject(new Error(response.error || 'Payment execution failed'));
            }
          } catch (error) {
            bKash.execute().onError();
            reject(error);
          }
        },
        
        onClose: function() {
          reject(new Error('User closed the payment popup'));
        }
      });
    } else {
      reject(new Error('bKash script not loaded'));
    }
  });
};
