
import { execute } from '../config/db.js';

class BkashModel {
  // Create bKash transaction record
  static async createBkashTransaction(data) {
    const { 
      userId, paymentId, merchantInvoiceNumber, amount, 
      currency, intent, paymentStatus, transactionStatus 
    } = data;
    
    try {
      const result = await execute(
        `INSERT INTO bkash_transactions 
        (user_id, payment_id, merchant_invoice_number, amount, currency, intent, payment_status, transaction_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, paymentId, merchantInvoiceNumber, amount, currency || 'BDT', intent || 'sale', paymentStatus, transactionStatus]
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Error creating bKash transaction:', error);
      throw new Error('Failed to create bKash transaction record');
    }
  }

  // Update bKash transaction
  static async updateBkashTransaction(paymentId, data) {
    const { trxId, paymentStatus, transactionStatus, customerMsisdn, paymentExecuteTime } = data;
    
    try {
      const result = await execute(
        `UPDATE bkash_transactions 
        SET trx_id = ?, payment_status = ?, transaction_status = ?, 
            customer_msisdn = ?, payment_execute_time = ?, updated_at = NOW()
        WHERE payment_id = ?`,
        [trxId, paymentStatus, transactionStatus, customerMsisdn, paymentExecuteTime, paymentId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating bKash transaction:', error);
      throw new Error('Failed to update bKash transaction');
    }
  }

  // Get bKash transaction by payment ID
  static async getBkashTransactionByPaymentId(paymentId) {
    try {
      const result = await execute(
        'SELECT * FROM bkash_transactions WHERE payment_id = ?',
        [paymentId]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting bKash transaction:', error);
      throw new Error('Failed to get bKash transaction');
    }
  }

  // Get bKash transactions by user
  static async getBkashTransactionsByUser(userId) {
    try {
      const result = await execute(
        'SELECT * FROM bkash_transactions WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Error getting user bKash transactions:', error);
      throw new Error('Failed to get bKash transactions');
    }
  }

  // Add bKash payment method
  static async addBkashPaymentMethod(userId, bkashNumber) {
    try {
      // First, set all other bKash methods for this user as non-default
      await execute(
        'UPDATE payment_methods SET is_default = 0 WHERE user_id = ? AND provider = "bkash"',
        [userId]
      );
      
      const result = await execute(
        `INSERT INTO payment_methods 
        (user_id, type, last4, provider, bkash_account_number, verification_status, is_default) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, 'bkash', bkashNumber.slice(-4), 'bkash', bkashNumber, 'pending', 1]
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Error adding bKash payment method:', error);
      throw new Error('Failed to add bKash payment method');
    }
  }

  // Update bKash verification status
  static async updateBkashVerificationStatus(userId, bkashNumber, status) {
    try {
      const result = await execute(
        'UPDATE payment_methods SET verification_status = ? WHERE user_id = ? AND bkash_account_number = ?',
        [status, userId, bkashNumber]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating bKash verification status:', error);
      throw new Error('Failed to update verification status');
    }
  }
}

export default BkashModel;
