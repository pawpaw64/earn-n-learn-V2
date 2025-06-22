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
 // Get monthly financials for dashboard (6 months)
  static async getMonthlyFinancials(userId) {
    try {
      const result = await execute(
        `SELECT 
    MONTH(date) as month,
    YEAR(date) as year,
    DATE_FORMAT(date, '%b') as name,
    COALESCE(SUM(CASE WHEN type IN ('deposit', 'release') THEN amount ELSE 0 END), 0) as income,
    COALESCE(SUM(CASE WHEN type IN ('withdrawal', 'payment', 'escrow') THEN amount ELSE 0 END), 0) as expenses
FROM transactions 
WHERE user_id = 2 AND date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY YEAR(date), MONTH(date), DATE_FORMAT(date, '%b')
ORDER BY YEAR(date), MONTH(date)`,
        [userId]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      
      // Fill missing months with zero data
      const monthlyData = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const existingData = rows.find(row => row.month === month && row.year === year);
        
        monthlyData.push({
          name: monthName,
          income: parseFloat(existingData?.income || 0),
          expenses: parseFloat(existingData?.expenses || 0)
        });
      }
      
      return {
        monthlyData,
        totalIncome: monthlyData.reduce((sum, item) => sum + item.income, 0),
        totalExpenses: monthlyData.reduce((sum, item) => sum + item.expenses, 0)
      };
    } catch (error) {
      console.error('Error getting monthly financials:', error);
      throw error;
    }
  }

  // Get quarterly financials for dashboard (4 quarters)
  static async getQuarterlyFinancials(userId) {
    try {
      const result = await execute(
        `SELECT 
          CONCAT('Q', QUARTER(date)) as name,
          QUARTER(date) as quarter,
          YEAR(date) as year,
          COALESCE(SUM(CASE WHEN type IN ('deposit', 'release') THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN type IN ('withdrawal', 'payment', 'escrow') THEN amount ELSE 0 END), 0) as expenses
        FROM transactions 
        WHERE user_id = ? AND date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY YEAR(date), QUARTER(date)
        ORDER BY YEAR(date), QUARTER(date)`,
        [userId]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      
      // Fill missing quarters with zero data
      const quarterlyData = [];
      const now = new Date();
      const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
      
      for (let i = 3; i >= 0; i--) {
        let quarter = currentQuarter - i;
        let year = now.getFullYear();
        
        if (quarter <= 0) {
          quarter += 4;
          year -= 1;
        }
        
        const existingData = rows.find(row => row.quarter === quarter && row.year === year);
        
        quarterlyData.push({
          name: `Q${quarter}`,
          income: parseFloat(existingData?.income || 0),
          expenses: parseFloat(existingData?.expenses || 0)
        });
      }
      
      return {
        monthlyData: quarterlyData,
        totalIncome: quarterlyData.reduce((sum, item) => sum + item.income, 0),
        totalExpenses: quarterlyData.reduce((sum, item) => sum + item.expenses, 0)
      };
    } catch (error) {
      console.error('Error getting quarterly financials:', error);
      throw error;
    }
  }

  // Get yearly financials for dashboard (3 years)
  static async getYearlyFinancials(userId) {
    try {
      const result = await execute(
        `SELECT 
          YEAR(date) as name,
          COALESCE(SUM(CASE WHEN type IN ('deposit', 'release') THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN type IN ('withdrawal', 'payment', 'escrow') THEN amount ELSE 0 END), 0) as expenses
        FROM transactions 
        WHERE user_id = ? AND date >= DATE_SUB(NOW(), INTERVAL 3 YEAR)
        GROUP BY YEAR(date)
        ORDER BY YEAR(date)`,
        [userId]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      
      // Fill missing years with zero data
      const yearlyData = [];
      const currentYear = new Date().getFullYear();
      
      for (let i = 2; i >= 0; i--) {
        const year = currentYear - i;
        const existingData = rows.find(row => row.name === year);
        
        yearlyData.push({
          name: year.toString(),
          income: parseFloat(existingData?.income || 0),
          expenses: parseFloat(existingData?.expenses || 0)
        });
      }
      
      return {
        monthlyData: yearlyData,
        totalIncome: yearlyData.reduce((sum, item) => sum + item.income, 0),
        totalExpenses: yearlyData.reduce((sum, item) => sum + item.expenses, 0)
      };
    } catch (error) {
      console.error('Error getting yearly financials:', error);
      throw error;
    }
  }

  // Get expense breakdown by category
  static async getExpenseBreakdown(userId, timeframe) {
    try {
      let dateFilter;
      switch (timeframe) {
        case 'quarterly':
          dateFilter = 'DATE_SUB(NOW(), INTERVAL 12 MONTH)';
          break;
        case 'yearly':
          dateFilter = 'DATE_SUB(NOW(), INTERVAL 3 YEAR)';
          break;
        default: // monthly
          dateFilter = 'DATE_SUB(NOW(), INTERVAL 6 MONTH)';
      }
      
      // Categorize expenses based on description keywords
      const result = await execute(`
        SELECT 
          CASE 
            WHEN description LIKE '%education%' OR description LIKE '%course%' OR description LIKE '%learning%' THEN 'Education'
            WHEN description LIKE '%transport%' OR description LIKE '%travel%' OR description LIKE '%uber%' OR description LIKE '%taxi%' THEN 'Transport'
            WHEN description LIKE '%food%' OR description LIKE '%restaurant%' OR description LIKE '%meal%' THEN 'Food'
            WHEN description LIKE '%utility%' OR description LIKE '%electricity%' OR description LIKE '%water%' OR description LIKE '%internet%' THEN 'Utilities'
            WHEN description LIKE '%entertainment%' OR description LIKE '%movie%' OR description LIKE '%game%' THEN 'Entertainment'
            WHEN description LIKE '%withdrawal%' THEN 'Withdrawals'
            WHEN description LIKE '%escrow%' THEN 'Escrow Deposits'
            ELSE 'Other'
          END as name,
          SUM(amount) as value
        FROM transactions 
        WHERE user_id = ? AND type IN ('withdrawal', 'payment', 'escrow') 
        AND date >= ${dateFilter}
        GROUP BY name
        HAVING value > 0
        ORDER BY value DESC`,
        [userId]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      
      return rows.map(row => ({
        name: row.name,
        value: parseFloat(row.value)
      }));
    } catch (error) {
      console.error('Error getting expense breakdown:', error);
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

  // Add savings goal
  static async addSavingsGoal(userId, data) {
    const { name, targetAmount, currentAmount, deadline } = data;
    
    try {
      const result = await execute(
        'INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline) VALUES (?, ?, ?, ?, ?)',
        [userId, name, targetAmount, currentAmount || 0, deadline]
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Savings goal creation error:', {
        error: error.message,
        query: 'INSERT INTO savings_goals...',
        parameters: [userId, name, targetAmount, currentAmount, deadline]
      });
      throw new Error('Failed to add savings goal');
    }
  }

  // Update savings goal amount
  static async updateSavingsGoal(userId, goalId, amount) {
    try {
      const result = await execute(
        'UPDATE savings_goals SET current_amount = current_amount + ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
        [amount, goalId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in updateSavingsGoal:', {
        error: error.message,
        query: 'UPDATE savings_goals...',
        parameters: [amount, goalId, userId]
      });
      throw new Error('Failed to update savings goal');
    }
  }

  // Delete savings goal
  static async deleteSavingsGoal(userId, goalId) {
    try {
      const result = await execute(
        'DELETE FROM savings_goals WHERE id = ? AND user_id = ?',
        [goalId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in deleteSavingsGoal:', error);
      throw new Error('Failed to delete savings goal');
    }
  }

  // Edit savings goal details
  static async editSavingsGoal(userId, goalId, data) {
    const { name, targetAmount, currentAmount, deadline } = data;
    
    try {
      const result = await execute(
        'UPDATE savings_goals SET name = ?, target_amount = ?, current_amount = ?, deadline = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
        [name, targetAmount, currentAmount, deadline, goalId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in editSavingsGoal:', {
        error: error.message,
        query: 'UPDATE savings_goals...',
        parameters: [name, targetAmount, currentAmount, deadline, goalId, userId]
      });
      throw new Error('Failed to edit savings goal');
    }
  }
}

export default WalletModel;
