
import { execute } from '../config/db.js';

class WalletModel {
  static async createWallet(userId) {
    try {
      const [result] = await execute(
        'INSERT INTO wallets (user_id, balance) VALUES (?, ?) ON DUPLICATE KEY UPDATE updated_at = NOW()',
        [userId, 0]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  static async getWallet(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM wallets WHERE user_id = ?',
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error('Error getting wallet:', error);
      throw error;
    }
  }

  static async updateBalance(userId, amount) {
    try {
      const [result] = await execute(
        'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
        [amount, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      throw error;
    }
  }

  static async getPaymentMethods(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM payment_methods WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  static async addPaymentMethod(userId, data) {
    const { type, last4, expiryMonth, expiryYear, isDefault } = data;
    try {
      // If the new method is set as default, unset any existing default
      if (isDefault) {
        await execute(
          'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?',
          [userId]
        );
      }
      
      const [result] = await execute(
        'INSERT INTO payment_methods (user_id, type, last4, expiry_month, expiry_year, is_default) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, type, last4, expiryMonth, expiryYear, isDefault ? 1 : 0]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  static async updatePaymentMethodDefault(userId, methodId) {
    try {
      // First, set all payment methods to non-default
      await execute(
        'UPDATE payment_methods SET is_default = 0 WHERE user_id = ?',
        [userId]
      );
      
      // Then set the specified one as default
      const [result] = await execute(
        'UPDATE payment_methods SET is_default = 1 WHERE id = ? AND user_id = ?',
        [methodId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating payment method default:', error);
      throw error;
    }
  }

  static async deletePaymentMethod(userId, methodId) {
    try {
      const [result] = await execute(
        'DELETE FROM payment_methods WHERE id = ? AND user_id = ?',
        [methodId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }

  static async getTransactions(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  static async addTransaction(userId, data) {
    const { description, amount, type, status } = data;
    try {
      const [result] = await execute(
        'INSERT INTO transactions (user_id, description, amount, type, status) VALUES (?, ?, ?, ?, ?)',
        [userId, description, amount, type, status]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  static async getSavingsGoals(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM savings_goals WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting savings goals:', error);
      throw error;
    }
  }

  static async addSavingsGoal(userId, data) {
    const { name, targetAmount, currentAmount } = data;
    try {
      const [result] = await execute(
        'INSERT INTO savings_goals (user_id, name, target_amount, current_amount) VALUES (?, ?, ?, ?)',
        [userId, name, targetAmount, currentAmount]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error adding savings goal:', error);
      throw error;
    }
  }

  static async updateSavingsGoal(userId, goalId, amount) {
    try {
      const [result] = await execute(
        'UPDATE savings_goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?',
        [amount, goalId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating savings goal:', error);
      throw error;
    }
  }

  static async getEscrowTransactions(userId) {
    try {
      const [rows] = await execute(
        `SELECT et.*, 
          COALESCE(j.title, sm.skill_name, mm.title) as title,
          COALESCE(j.type, 'skill', 'material') as job_type,
          u.name as client_name,
          e.email as client_email
        FROM escrow_transactions et
        LEFT JOIN jobs j ON et.job_id = j.id
        LEFT JOIN skill_marketplace sm ON et.skill_id = sm.id
        LEFT JOIN material_marketplace mm ON et.material_id = mm.id
        LEFT JOIN users u ON et.client_id = u.id
        LEFT JOIN users e ON et.client_id = e.id
        WHERE et.provider_id = ? OR et.client_id = ?
        ORDER BY et.created_at DESC`,
        [userId, userId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting escrow transactions:', error);
      throw error;
    }
  }

  static async createEscrowTransaction(data) {
    const { 
      jobId, skillId, materialId, providerId, clientId, 
      amount, status, description 
    } = data;
    
    try {
      const [result] = await execute(
        `INSERT INTO escrow_transactions 
        (job_id, skill_id, material_id, provider_id, client_id, amount, status, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [jobId, skillId, materialId, providerId, clientId, amount, status, description]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating escrow transaction:', error);
      throw error;
    }
  }

  static async updateEscrowStatus(transactionId, status) {
    try {
      const [result] = await execute(
        'UPDATE escrow_transactions SET status = ? WHERE id = ?',
        [status, transactionId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating escrow status:', error);
      throw error;
    }
  }

  static async getMonthlyFinancials(userId, year, month) {
    try {
      // Calculate earnings (money coming in)
      const [earnings] = await execute(
        `SELECT SUM(amount) as total FROM transactions 
         WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ? 
         AND (type = 'deposit' OR type = 'release')`,
        [userId, year, month]
      );
      
      // Calculate spending (money going out)
      const [spending] = await execute(
        `SELECT SUM(amount) as total FROM transactions 
         WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ? 
         AND (type = 'withdrawal' OR type = 'payment')`,
        [userId, year, month]
      );
      
      return {
        earnings: earnings[0]?.total || 0,
        spending: spending[0]?.total || 0
      };
    } catch (error) {
      console.error('Error getting monthly financials:', error);
      throw error;
    }
  }
}

export default WalletModel;
