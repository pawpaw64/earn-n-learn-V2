
import { execute } from '../config/db.js';

class BkashModel {
  // Create bKash transaction
  static async createTransaction(data) {
    const {
      userId, paymentId, amount, currency, intent, merchantInvoiceNumber,
      paymentType, status, bkashStatus
    } = data;

    try {
      const result = await execute(
        `INSERT INTO bkash_transactions 
        (user_id, payment_id, amount, currency, intent, merchant_invoice_number, payment_type, status, bkash_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, paymentId, amount, currency || 'BDT', intent || 'sale', merchantInvoiceNumber, paymentType, status || 'created', bkashStatus]
      );

      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Error creating bKash transaction:', error);
      throw new Error('Failed to create bKash transaction');
    }
  }

  // Update bKash transaction
  static async updateTransaction(paymentId, data) {
    const { trxId, status, bkashStatus, walletTransactionId } = data;

    try {
      const result = await execute(
        `UPDATE bkash_transactions 
        SET trx_id = ?, status = ?, bkash_status = ?, wallet_transaction_id = ?, updated_at = NOW()
        WHERE payment_id = ?`,
        [trxId, status, bkashStatus, walletTransactionId, paymentId]
      );

      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating bKash transaction:', error);
      throw new Error('Failed to update bKash transaction');
    }
  }

  // Get bKash transaction by payment ID
  static async getTransactionByPaymentId(paymentId) {
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

  // Get user bKash transactions
  static async getUserTransactions(userId, limit = 50) {
    try {
      const result = await execute(
        'SELECT * FROM bkash_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, limit]
      );

      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Error getting user bKash transactions:', error);
      throw new Error('Failed to get user bKash transactions');
    }
  }

  // Add bKash account
  static async addAccount(userId, data) {
    const { accountNumber, accountHolderName, isDefault } = data;

    try {
      // If setting as default, update existing accounts
      if (isDefault) {
        await execute(
          'UPDATE bkash_accounts SET is_default = 0 WHERE user_id = ?',
          [userId]
        );
      }

      const result = await execute(
        `INSERT INTO bkash_accounts (user_id, account_number, account_holder_name, is_default)
        VALUES (?, ?, ?, ?)`,
        [userId, accountNumber, accountHolderName, isDefault ? 1 : 0]
      );

      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Error adding bKash account:', error);
      throw new Error('Failed to add bKash account');
    }
  }

  // Get user bKash accounts
  static async getUserAccounts(userId) {
    try {
      const result = await execute(
        'SELECT * FROM bkash_accounts WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
        [userId]
      );

      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Error getting user bKash accounts:', error);
      throw new Error('Failed to get user bKash accounts');
    }
  }

  // Update account default status
  static async updateAccountDefault(userId, accountId) {
    try {
      // First, remove default from all accounts
      await execute(
        'UPDATE bkash_accounts SET is_default = 0 WHERE user_id = ?',
        [userId]
      );

      // Then set the specified account as default
      const result = await execute(
        'UPDATE bkash_accounts SET is_default = 1 WHERE id = ? AND user_id = ?',
        [accountId, userId]
      );

      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating bKash account default:', error);
      throw new Error('Failed to update bKash account default');
    }
  }

  // Delete bKash account
  static async deleteAccount(userId, accountId) {
    try {
      const result = await execute(
        'DELETE FROM bkash_accounts WHERE id = ? AND user_id = ?',
        [accountId, userId]
      );

      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting bKash account:', error);
      throw new Error('Failed to delete bKash account');
    }
  }

  // Verify account
  static async verifyAccount(userId, accountId) {
    try {
      const result = await execute(
        'UPDATE bkash_accounts SET is_verified = 1 WHERE id = ? AND user_id = ?',
        [accountId, userId]
      );

      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Error verifying bKash account:', error);
      throw new Error('Failed to verify bKash account');
    }
  }
}

export default BkashModel;
