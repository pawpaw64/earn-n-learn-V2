import SSLCommerzPayment from 'sslcommerz-lts';

// SSLCommerz Configuration
const STORE_ID = process.env.SSLCOMMERZ_STORE_ID || 'test_store_id';
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD || 'test_store_password';
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === 'true' || false;

// Initialize SSLCommerz
export const sslcommerz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);

// Base URLs for callbacks
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

export const getSSLCommerzConfig = (transactionId, amount, userInfo) => {
  return {
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${BASE_URL}/api/wallet/sslcommerz/success`,
    fail_url: `${BASE_URL}/api/wallet/sslcommerz/fail`,
    cancel_url: `${BASE_URL}/api/wallet/sslcommerz/cancel`,
    ipn_url: `${BASE_URL}/api/wallet/sslcommerz/ipn`,
    shipping_method: 'NO',
    product_name: 'Wallet Top Up',
    product_category: 'Service',
    product_profile: 'general',
    cus_name: userInfo.name || 'Customer',
    cus_email: userInfo.email || 'customer@example.com',
    cus_add1: userInfo.address || 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: userInfo.phone || '01700000000',
    cus_fax: '01700000000',
    ship_name: userInfo.name || 'Customer',
    ship_add1: userInfo.address || 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
};

export default { sslcommerz, getSSLCommerzConfig };