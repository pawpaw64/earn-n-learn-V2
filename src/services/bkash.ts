
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export interface BkashPaymentResponse {
  success: boolean;
  paymentID: string;
  bkashURL: string;
  amount: number;
  merchantInvoiceNumber: string;
}

export interface BkashExecuteResponse {
  success: boolean;
  transactionStatus: string;
  trxID: string;
  amount: number;
}

class BkashService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async initiateBkashPayment(amount: number, purpose: string = 'wallet_topup'): Promise<BkashPaymentResponse> {
    const response = await axios.post(`${API_BASE}/bkash/initiate-payment`, {
      amount,
      purpose
    }, {
      headers: this.getAuthHeaders()
    });
    
    return response.data;
  }

  async executeBkashPayment(paymentID: string): Promise<BkashExecuteResponse> {
    const response = await axios.post(`${API_BASE}/bkash/execute-payment`, {
      paymentID
    }, {
      headers: this.getAuthHeaders()
    });
    
    return response.data;
  }

  async queryBkashPayment(paymentID: string) {
    const response = await axios.get(`${API_BASE}/bkash/query-payment/${paymentID}`, {
      headers: this.getAuthHeaders()
    });
    
    return response.data;
  }

  async addBkashPaymentMethod(bkashNumber: string) {
    const response = await axios.post(`${API_BASE}/bkash/add-payment-method`, {
      bkashNumber
    }, {
      headers: this.getAuthHeaders()
    });
    
    return response.data;
  }

  async processBkashWithdrawal(amount: number, bkashNumber: string) {
    const response = await axios.post(`${API_BASE}/bkash/withdraw`, {
      amount,
      bkashNumber
    }, {
      headers: this.getAuthHeaders()
    });
    
    return response.data;
  }

  // Open bKash checkout in popup
  openBkashCheckout(bkashURL: string, paymentID: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const popup = window.open(bkashURL, 'bkash_checkout', 'width=600,height=700,scrollbars=yes,resizable=yes');
      
      if (!popup) {
        reject(new Error('Popup blocked. Please allow popups for bKash checkout.'));
        return;
      }

      // Poll for popup closure
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          resolve(paymentID);
        }
      }, 1000);

      // Timeout after 10 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        if (!popup.closed) {
          popup.close();
        }
        reject(new Error('Payment timeout'));
      }, 600000);
    });
  }
}

export default new BkashService();
