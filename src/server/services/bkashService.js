
import axios from 'axios';

class BkashService {
  constructor() {
    // bKash Sandbox Configuration
    this.baseUrl = 'https://checkout.sandbox.bka.sh/v1.2.0-beta';
    this.credentials = {
      username: process.env.BKASH_USERNAME || 'sandboxTokenizedUser02',
      password: process.env.BKASH_PASSWORD || 'sandboxTokenizedUser02@12345',
      app_key: process.env.BKASH_APP_KEY || '4f6o0cjiki2rfm34kfdadl1eqq',
      app_secret: process.env.BKASH_APP_SECRET || '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b'
    };
    this.idToken = null;
    this.tokenExpiry = null;
  }

  // Get authentication token
  async getAuthToken() {
    try {
      const response = await axios.post(
        `${this.baseUrl}/checkout/token/grant`,
        {
          app_key: this.credentials.app_key,
          app_secret: this.credentials.app_secret
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'username': this.credentials.username,
            'password': this.credentials.password
          }
        }
      );

      if (response.data && response.data.id_token) {
        this.idToken = response.data.id_token;
        // Token expires in 1 hour, refresh 5 minutes before
        this.tokenExpiry = Date.now() + (55 * 60 * 1000);
        return this.idToken;
      } else {
        throw new Error('Failed to get bKash auth token');
      }
    } catch (error) {
      console.error('bKash auth error:', error.response?.data || error.message);
      throw new Error('bKash authentication failed');
    }
  }

  // Get headers for authenticated requests
  async getAuthHeaders() {
    // Check if token is expired or about to expire
    if (!this.idToken || Date.now() >= this.tokenExpiry) {
      await this.getAuthToken();
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': this.idToken,
      'X-APP-Key': this.credentials.app_key
    };
  }

  // Create payment
  async createPayment(amount, merchantInvoiceNumber) {
    try {
      const headers = await this.getAuthHeaders();
      
      const paymentRequest = {
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: merchantInvoiceNumber
      };

      const response = await axios.post(
        `${this.baseUrl}/checkout/payment/create`,
        paymentRequest,
        { headers }
      );

      if (response.data && response.data.paymentID) {
        return {
          success: true,
          paymentID: response.data.paymentID,
          createTime: response.data.createTime,
          orgLogo: response.data.orgLogo,
          orgName: response.data.orgName,
          transactionStatus: response.data.transactionStatus,
          amount: response.data.amount,
          currency: response.data.currency,
          intent: response.data.intent,
          merchantInvoiceNumber: response.data.merchantInvoiceNumber
        };
      } else {
        return {
          success: false,
          error: response.data?.errorMessage || 'Payment creation failed'
        };
      }
    } catch (error) {
      console.error('bKash create payment error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Payment creation failed'
      };
    }
  }

  // Execute payment
  async executePayment(paymentID) {
    try {
      const headers = await this.getAuthHeaders();

      const response = await axios.post(
        `${this.baseUrl}/checkout/payment/execute/${paymentID}`,
        {},
        { headers }
      );

      if (response.data && response.data.paymentID) {
        return {
          success: true,
          paymentID: response.data.paymentID,
          trxID: response.data.trxID,
          transactionStatus: response.data.transactionStatus,
          amount: response.data.amount,
          currency: response.data.currency,
          intent: response.data.intent,
          paymentExecuteTime: response.data.paymentExecuteTime,
          merchantInvoiceNumber: response.data.merchantInvoiceNumber,
          payerReference: response.data.payerReference
        };
      } else {
        return {
          success: false,
          error: response.data?.errorMessage || 'Payment execution failed'
        };
      }
    } catch (error) {
      console.error('bKash execute payment error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Payment execution failed'
      };
    }
  }

  // Query payment status
  async queryPayment(paymentID) {
    try {
      const headers = await this.getAuthHeaders();

      const response = await axios.get(
        `${this.baseUrl}/checkout/payment/query/${paymentID}`,
        { headers }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('bKash query payment error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Payment query failed'
      };
    }
  }

  // Search transactions
  async searchTransaction(trxID) {
    try {
      const headers = await this.getAuthHeaders();

      const response = await axios.get(
        `${this.baseUrl}/checkout/payment/search/${trxID}`,
        { headers }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('bKash search transaction error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Transaction search failed'
      };
    }
  }
}

export default new BkashService();
