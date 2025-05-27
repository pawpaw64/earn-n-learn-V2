import { execute } from '../config/db.js';

class WalletModel {
  // Create wallet
  static async createWallet(userId) {
    try {
      const result = await execute(
        'INSERT INTO wallets (user_id, balance) VALUES (?, ?) ON DUPLICATE KEY UPDATE updated_at = NOW()',
        [userId, 0.00]
      );
      
      // Handle different database client responses
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId || userId;
    } catch (error) {
      console.error('Wallet creation error:', {
        error: error.message,
        query: 'INSERT INTO wallets...',
        parameters: [userId, 0.00]
      });
      throw new Error('Failed to create wallet');
    }
  }

  // Get wallet
  static async getWallet(userId) {
    try {
      const result = await execute(
        'SELECT * FROM wallets WHERE user_id = ?',
        [userId]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0] || null;
    } catch (error) {
      console.error('Database error in getWallet:', error);
      throw new Error(error.message);
    }
  }

  // Update balance
  static async updateBalance(userId, amount) {
    try {
      const result = await execute(
        'UPDATE wallets SET balance = balance + ?, updated_at = NOW() WHERE user_id = ?',
        [amount, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in updateBalance:', {
        error: error.message,
        query: 'UPDATE wallets...',
        parameters: [amount, userId]
      });
      throw new Error('Failed to update balance');
    }
  }

  // Get payment methods
  static async getPaymentMethods(userId) {
    try {
      const result = await execute(
        'SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
        [userId]
      );
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getPaymentMethods:', error);
      throw new Error(error.message);
    }
  }

  // Add payment method
  static async addPaymentMethod(userId, data) {
    const { type, last4, expiryMonth, expiryYear, provider, isDefault } = data;
    
    try {
      if (isDefault) {
        await execute(
          'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?',
          [userId]
        );
      }
      
      const result = await execute(
        'INSERT INTO payment_methods (user_id, type, last4, expiry_month, expiry_year, provider, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, type, last4, expiryMonth || null, expiryYear || null, provider || 'card', isDefault ? 1 : 0]
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Payment method creation error:', {
        error: error.message,
        query: 'INSERT INTO payment_methods...',
        parameters: [userId, type, last4, expiryMonth, expiryYear, provider, isDefault]
      });
      throw new Error('Failed to add payment method');
    }
  }

  // Update payment method default status
  static async updatePaymentMethodDefault(userId, methodId) {
    try {
      await execute(
        'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?',
        [userId]
      );
      
      const result = await execute(
        'UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?',
        [methodId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in updatePaymentMethodDefault:', error);
      throw new Error(error.message);
    }
  }

  // Delete payment method
  static async deletePaymentMethod(userId, methodId) {
    try {
      const result = await execute(
        'DELETE FROM payment_methods WHERE id = ? AND user_id = ?',
        [methodId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in deletePaymentMethod:', error);
      throw new Error(error.message);
    }
  }

  // In walletModel.js (add this method)
  static async getMonthlyFinancials(userId, year, month) {
    try {
      // Calculate earnings (money coming in)
      const [earningsResult] = await execute(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
         WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ? 
         AND type IN ('deposit', 'release')`,
        [userId, year, month]
      );
      
      // Calculate spending (money going out)
      const [spendingResult] = await execute(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
         WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ? 
         AND type IN ('withdrawal', 'payment', 'escrow')`,
        [userId, year, month]
      );
      
      return {
        earnings: parseFloat(earningsResult[0]?.total || 0),
        spending: parseFloat(spendingResult[0]?.total || 0)
      };
    } catch (error) {
      console.error('Error getting monthly financials:', error);
      throw error;
    }
  }

  // Also make sure these methods exist in WalletModel:
  static async getEscrowTransactions(userId) {
    try {
      const result = await execute(
        `SELECT et.*, 
          COALESCE(j.title, sm.skill_name, mm.title) as title,
          COALESCE(j.description, sm.description, mm.description) as description,
          CASE 
            WHEN et.job_id IS NOT NULL THEN 'job'
            WHEN et.skill_id IS NOT NULL THEN 'skill'
            WHEN et.material_id IS NOT NULL THEN 'material'
            ELSE 'unknown'
          END as job_type,
          provider.name as provider_name,
          provider.email as provider_email,
          client.name as client_name,
          client.email as client_email
        FROM escrow_transactions et
        LEFT JOIN jobs j ON et.job_id = j.id
        LEFT JOIN skill_marketplace sm ON et.skill_id = sm.id
        LEFT JOIN material_marketplace mm ON et.material_id = mm.id
        LEFT JOIN users provider ON et.provider_id = provider.id
        LEFT JOIN users client ON et.client_id = client.id
        WHERE et.provider_id = ? OR et.client_id = ?
        ORDER BY et.created_at DESC`,
        [userId, userId]
      );
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Error getting escrow transactions:', error);
      throw error;
    }
  }

  static async getSavingsGoals(userId) {
    try {
      const result = await execute(
        'SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Error getting savings goals:', error);
      throw error;
    }
  }

  // Get transactions
  static async getTransactions(userId, limit = 50) {
    try {
      const result = await execute(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT ?',
        [userId, limit]
      );
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getTransactions:', error);
      throw new Error(error.message);
    }
  }

  // Add transaction
  static async addTransaction(userId, data) {
    const { description, amount, type, status, referenceId, referenceType } = data;
    
    try {
      const result = await execute(
        'INSERT INTO transactions (user_id, description, amount, type, status, reference_id, reference_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, description, amount, type, status || 'completed', referenceId || null, referenceType || null]
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Transaction creation error:', {
        error: error.message,
        query: 'INSERT INTO transactions...',
        parameters: [userId, description, amount, type, status, referenceId, referenceType]
      });
      throw new Error('Failed to add transaction');
    }
  }

  static async createEscrowTransaction(data) {
    const { 
      jobId, skillId, materialId, providerId, clientId, 
      amount, status, description 
    } = data;
    
    try {
      const result = await execute(
        `INSERT INTO escrow_transactions 
        (job_id, skill_id, material_id, provider_id, client_id, amount, status, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          jobId || null, 
          skillId || null, 
          materialId || null, 
          providerId, 
          clientId, 
          amount, 
          status || 'funded', 
          description || ''
        ]
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Error creating escrow transaction:', {
        error: error.message,
        query: 'INSERT INTO escrow_transactions...',
        parameters: [jobId, skillId, materialId, providerId, clientId, amount, status, description]
      });
      throw new Error('Failed to create escrow transaction');
    }
  }

  // UPDATE ESCROW STATUS
  static async updateEscrowStatus(transactionId, status) {
    try {
      const result = await execute(
        'UPDATE escrow_transactions SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, transactionId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating escrow status:', {
        error: error.message,
        query: 'UPDATE escrow_transactions...',
        parameters: [status, transactionId]
      });
      throw new Error('Failed to update escrow status');
    }
  }
}

export default WalletModel;
