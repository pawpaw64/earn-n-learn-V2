
import axios from 'axios';

class BkashService {
  constructor() {
    // bKash Sandbox Configuration
    this.baseURL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
    this.config = {
      app_key: process.env.BKASH_APP_KEY || 'demo_app_key',
      app_secret: process.env.BKASH_APP_SECRET || 'demo_app_secret',
      username: process.env.BKASH_USERNAME || 'sandboxTokenizedUser02',
      password: process.env.BKASH_PASSWORD || 'sandboxTokenizedUser02@12345'
    };
    this.token = null;
    this.tokenExpiry = null;
  }

  // Get grant token from bKash
  async getGrantToken() {
    try {
      const response = await axios.post(`${this.baseURL}/tokenized/checkout/token/grant`, {
        app_key: this.config.app_key,
        app_secret: this.config.app_secret
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'username': this.config.username,
          'password': this.config.password
        }
      });

      if (response.data && response.data.id_token) {
        this.token = response.data.id_token;
        this.tokenExpiry = Date.now() + (3600 * 1000); // 1 hour
        return this.token;
      }
      
      throw new Error('Failed to get bKash token');
    } catch (error) {
      console.error('bKash grant token error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Ensure we have a valid token
  async ensureValidToken() {
    if (!this.token || Date.now() >= this.tokenExpiry) {
      await this.getGrantToken();
    }
    return this.token;
  }

  // Create payment
  async createPayment(amount, merchantInvoiceNumber, intent = 'sale') {
    try {
      const token = await this.ensureValidToken();
      
      const response = await axios.post(`${this.baseURL}/tokenized/checkout/create`, {
        mode: '0011',
        payerReference: merchantInvoiceNumber,
        callbackURL: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/api/bkash/callback`,
        amount: amount.toString(),
        currency: 'BDT',
        intent: intent,
        merchantInvoiceNumber: merchantInvoiceNumber
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': token,
          'x-app-key': this.config.app_key
        }
      });

      return response.data;
    } catch (error) {
      console.error('bKash create payment error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Execute payment
  async executePayment(paymentID) {
    try {
      const token = await this.ensureValidToken();
      
      const response = await axios.post(`${this.baseURL}/tokenized/checkout/execute`, {
        paymentID: paymentID
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': token,
          'x-app-key': this.config.app_key
        }
      });

      return response.data;
    } catch (error) {
      console.error('bKash execute payment error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Query payment
  async queryPayment(paymentID) {
    try {
      const token = await this.ensureValidToken();
      
      const response = await axios.post(`${this.baseURL}/tokenized/checkout/payment/status`, {
        paymentID: paymentID
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': token,
          'x-app-key': this.config.app_key
        }
      });

      return response.data;
    } catch (error) {
      console.error('bKash query payment error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Refund payment (for withdrawals)
  async refundPayment(paymentID, amount, trxID, sku) {
    try {
      const token = await this.ensureValidToken();
      
      const response = await axios.post(`${this.baseURL}/tokenized/checkout/payment/refund`, {
        paymentID: paymentID,
        amount: amount.toString(),
        trxID: trxID,
        sku: sku,
        reason: 'Wallet withdrawal'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'authorization': token,
          'x-app-key': this.config.app_key
        }
      });

      return response.data;
    } catch (error) {
      console.error('bKash refund payment error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new BkashService();
