
import WalletModel from '../models/walletModel.js';

// Get financial data for dashboard
export async function getFinancialData(req, res) {
  try {
    const userId = req.user.id;
    const { timeframe } = req.query;
    
    console.log('Getting financial data for user:', userId, 'timeframe:', timeframe);
    
    let financialData;
    
    switch (timeframe) {
      case 'quarterly':
        financialData = await WalletModel.getQuarterlyFinancials(userId);
        break;
      case 'yearly':
        financialData = await WalletModel.getYearlyFinancials(userId);
        break;
      default: // monthly
        financialData = await WalletModel.getMonthlyFinancials(userId);
    }
    
    res.json(financialData);
    
  } catch (error) {
    console.error('Get financial data error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get expense breakdown by category
export async function getExpenseBreakdown(req, res) {
  try {
    const userId = req.user.id;
    const { timeframe } = req.query;
    
    console.log('Getting expense breakdown for user:', userId, 'timeframe:', timeframe);
    
    const expenseBreakdown = await WalletModel.getExpenseBreakdown(userId, timeframe);
    
    res.json(expenseBreakdown);
    
  } catch (error) {
    console.error('Get expense breakdown error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
// Get wallet details
export async function getWalletDetails(req, res) {
  try {
    const userId = req.user.id;
    console.log('Getting wallet details for user:', userId);
    
    // Get wallet, if doesn't exist, create one
    let wallet = await WalletModel.getWallet(userId);
    if (!wallet) {
      console.log('Creating new wallet for user:', userId);
      await WalletModel.createWallet(userId);
      wallet = { id: null, user_id: userId, balance: 0.00 };
    }
    
    // Get current month's financials
       const currentMonthFinancials = await WalletModel.getCurrentMonthFinancials(userId);

    
    // Get escrow balance (sum of all funded/in-progress escrow transactions where user is provider)
    const escrowTransactions = await WalletModel.getEscrowTransactions(userId);
    const pendingEscrow = escrowTransactions
      .filter(tx => ['funded', 'in_progress'].includes(tx.status) && tx.provider_id === userId)
      .reduce((total, tx) => total + parseFloat(tx.amount || 0), 0);
    
    // Get savings goals for progress calculation
    const savingsGoals = await WalletModel.getSavingsGoals(userId);
    const savingsProgress = savingsGoals.length > 0 && savingsGoals[0].target_amount > 0
      ? Math.round((parseFloat(savingsGoals[0].current_amount) / parseFloat(savingsGoals[0].target_amount)) * 100)
      : 0;
    
    const response = {
      balance: parseFloat(wallet.balance || 0),
      pendingEscrow,
      monthlyEarnings: currentMonthFinancials.earnings,
      monthlySpending: currentMonthFinancials.spending,
      savingsProgress
    };
    
    console.log('Wallet details response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('Get wallet details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Top up wallet
export async function topUpWallet(req, res) {
  try {
    const userId = req.user.id;
    const { amount, paymentMethod } = req.body;
    
    console.log('Top up request:', { userId, amount, paymentMethod });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Ensure wallet exists
    let wallet = await WalletModel.getWallet(userId);
    if (!wallet) {
      await WalletModel.createWallet(userId);
    }
    
    // Update the wallet balance
    const updated = await WalletModel.updateBalance(userId, parseFloat(amount));
    if (!updated) {
      return res.status(500).json({ message: 'Failed to update wallet balance' });
    }
    
    // Record the transaction
    await WalletModel.addTransaction(userId, {
      description: `Top up via ${paymentMethod || 'card'}`,
      amount: parseFloat(amount),
      type: 'deposit',
      status: 'completed'
    });
    
    // Get the updated wallet
    wallet = await WalletModel.getWallet(userId);
    
    res.json({
      message: 'Top up successful',
      balance: parseFloat(wallet.balance)
    });
    
  } catch (error) {
    console.error('Top up wallet error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Withdraw from wallet
export async function withdrawFromWallet(req, res) {
  try {
    const userId = req.user.id;
    const { amount, withdrawMethod } = req.body;
    
    console.log('Withdraw request:', { userId, amount, withdrawMethod });
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Check if user has enough balance
    const wallet = await WalletModel.getWallet(userId);
    if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Update the wallet balance (subtract the amount)
    const updated = await WalletModel.updateBalance(userId, -parseFloat(amount));
    if (!updated) {
      return res.status(500).json({ message: 'Failed to update wallet balance' });
    }
    
    // Record the transaction
    await WalletModel.addTransaction(userId, {
      description: `Withdrawal to ${withdrawMethod || 'bank account'}`,
      amount: parseFloat(amount),
      type: 'withdrawal',
      status: 'completed'
    });
    
    // Get the updated wallet
    const updatedWallet = await WalletModel.getWallet(userId);
    
    res.json({
      message: 'Withdrawal successful',
      balance: parseFloat(updatedWallet.balance)
    });
    
  } catch (error) {
    console.error('Withdraw from wallet error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get payment methods
export async function getPaymentMethods(req, res) {
  try {
    const userId = req.user.id;
    const paymentMethods = await WalletModel.getPaymentMethods(userId);
    
    // Transform the database format to the frontend format
    const transformedMethods = paymentMethods.map(method => ({
      id: method.id,
      type: method.type,
      provider: method.provider,
      last4: method.last4,
      expiryMonth: method.expiry_month,
      expiryYear: method.expiry_year,
      isDefault: Boolean(method.is_default)
    }));
    
    res.json(transformedMethods);
    
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Add payment method
export async function addPaymentMethod(req, res) {
  try {
    const userId = req.user.id;
    const { type, last4, expiryMonth, expiryYear, provider, isDefault } = req.body;
    
    if (!type || !last4) {
      return res.status(400).json({ message: 'Invalid payment method details' });
    }
    
    // Add the payment method
    const methodId = await WalletModel.addPaymentMethod(userId, {
      type,
      last4,
      expiryMonth,
      expiryYear,
      provider: provider || 'card',
      isDefault: isDefault || false
    });
    
    res.json({
      id: methodId,
      message: 'Payment method added successfully'
    });
    
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Set default payment method
export async function setDefaultPaymentMethod(req, res) {
  try {
    const userId = req.user.id;
    const { methodId } = req.params;
    
    // Update the payment method to be default
    const success = await WalletModel.updatePaymentMethodDefault(userId, methodId);
    
    if (!success) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    res.json({
      message: 'Default payment method updated successfully'
    });
    
  } catch (error) {
    console.error('Set default payment method error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Delete payment method
export async function deletePaymentMethod(req, res) {
  try {
    const userId = req.user.id;
    const { methodId } = req.params;
    
    // Check if the method is default
    const paymentMethods = await WalletModel.getPaymentMethods(userId);
    const method = paymentMethods.find(m => m.id === parseInt(methodId));
    
    if (!method) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    if (method.is_default) {
      return res.status(400).json({ 
        message: 'Cannot delete default payment method. Set another method as default first.' 
      });
    }
    
    // Delete the payment method
    const success = await WalletModel.deletePaymentMethod(userId, methodId);
    
    if (!success) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    res.json({
      message: 'Payment method deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get transactions
export async function getTransactions(req, res) {
  try {
    const userId = req.user.id;
    const { filter } = req.query;
    
    let transactions = await WalletModel.getTransactions(userId);
    
    // Apply filter if specified
    if (filter && filter !== 'all') {
      transactions = transactions.filter(tx => tx.type === filter);
    }
    
    // Transform the database format to the frontend format
    const transformedTransactions = transactions.map(tx => ({
      id: tx.id,
      date: tx.date,
      description: tx.description,
      amount: parseFloat(tx.amount),
      type: tx.type,
      status: tx.status
    }));
    
    res.json(transformedTransactions);
    
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get savings goals
export async function getSavingsGoals(req, res) {
  try {
    const userId = req.user.id;
     console.log('Getting savings goals for user:', userId);
    const goals = await WalletModel.getSavingsGoals(userId);
    
    // Transform the database format to the frontend format
    const transformedGoals = goals.map(goal => ({
      id: goal.id,
      name: goal.name,
      targetAmount: parseFloat(goal.target_amount),
      currentAmount: parseFloat(goal.current_amount),
      deadline: goal.deadline,
      progress: goal.target_amount > 0 ? Math.round((goal.current_amount / goal.target_amount) * 100) : 0
    }));
        console.log('Transformed savings goals:', transformedGoals);

    
    res.json(transformedGoals);
    
  } catch (error) {
    console.error('Get savings goals error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Add savings goal
export async function addSavingsGoal(req, res) {
  try {
    const userId = req.user.id;
    const { name, targetAmount, deadline } = req.body;
        console.log('Add savings goal request:', { userId, name, targetAmount, deadline });

    if (!name || !targetAmount || targetAmount <= 0) {
      return res.status(400).json({ message: 'Invalid savings goal details' });
    }
    
    // Add the savings goal
    const goalId = await WalletModel.addSavingsGoal(userId, {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      deadline: deadline ? new Date(deadline) : null
    });
    
    res.json({
      id: goalId,
      message: 'Savings goal added successfully'
    });
    
  } catch (error) {
    console.error('Add savings goal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Update savings goal (add money to it)
export async function updateSavingsGoal(req, res) {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;
    const { amount } = req.body;
        console.log('Update savings goal request:', { userId, goalId, amount });

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Check if user has enough balance
    const wallet = await WalletModel.getWallet(userId);
    if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Update the wallet balance (subtract the amount)
    await WalletModel.updateBalance(userId, -parseFloat(amount));
    
    // Update the savings goal
    const success = await WalletModel.updateSavingsGoal(userId, goalId, parseFloat(amount));
    
    if (!success) {
      // Rollback the wallet balance update
          await WalletModel.updateBalance(userId, parseFloat(amount));
          return res.status(404).json({ message: 'Savings goal not found' });
        }
        
        res.json({
          message: 'Savings goal updated successfully'
        });
      } catch (error) {
        console.error('Update savings goal error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    }
    
 

// Edit savings goal details
export async function editSavingsGoal(req, res) {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;
    const { name, targetAmount, currentAmount, deadline } = req.body;
    
    console.log('Edit savings goal request:', { userId, goalId, name, targetAmount, currentAmount, deadline });
    
    if (!name || !targetAmount || targetAmount <= 0) {
      return res.status(400).json({ message: 'Invalid savings goal details' });
    }
    
    // Update the savings goal
    const success = await WalletModel.editSavingsGoal(userId, goalId, {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount || 0),
      deadline: deadline ? new Date(deadline) : null
    });
    
    if (!success) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    
    console.log('Savings goal edited successfully');
    
    res.json({
      message: 'Savings goal updated successfully'
    });
    
  } catch (error) {
    console.error('Edit savings goal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Delete savings goal
export async function deleteSavingsGoal(req, res) {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;
    
    console.log('Delete savings goal request:', { userId, goalId });
    
    // Delete the savings goal
    const success = await WalletModel.deleteSavingsGoal(userId, goalId);
    
    if (!success) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    
    console.log('Savings goal deleted successfully');
    
    res.json({
      message: 'Savings goal deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete savings goal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
 

// Get escrow transactions
export async function getEscrowTransactions(req, res) {
  try {
    const userId = req.user.id;
    const transactions = await WalletModel.getEscrowTransactions(userId);
    
    // Transform the database format to the frontend format
    const transformedTransactions = transactions.map(tx => ({
      id: tx.id,
      title: tx.title || 'Untitled',
      jobType: tx.job_type,
      amount: parseFloat(tx.amount),
      status: tx.status,
      clientName: tx.client_name,
      clientEmail: tx.client_email,
      providerName: tx.provider_name,
      providerEmail: tx.provider_email,
      createdAt: tx.created_at,
      updatedAt: tx.updated_at,
      description: tx.description,
      isProvider: tx.provider_id === userId
    }));
    
    res.json(transformedTransactions);
    
  } catch (error) {
    console.error('Get escrow transactions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Create escrow transaction
export async function createEscrowTransaction(req, res) {
  try {
    const clientId = req.user.id;
    const { 
      providerId, jobId, skillId, materialId, 
      amount, description 
    } = req.body;
    
    if (!providerId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid escrow details' });
    }
    
    if (!jobId && !skillId && !materialId) {
      return res.status(400).json({ message: 'Job, skill, or material ID is required' });
    }
    
    // Check if client has enough balance
    const wallet = await WalletModel.getWallet(clientId);
    if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Deduct from client's wallet
    await WalletModel.updateBalance(clientId, -parseFloat(amount));
    
    // Create the escrow transaction
    const escrowId = await WalletModel.createEscrowTransaction({
      jobId, 
      skillId, 
      materialId, 
      providerId, 
      clientId, 
      amount: parseFloat(amount), 
      status: 'funded',
      description
    });
    
    // Record the transaction
    await WalletModel.addTransaction(clientId, {
      description: `Escrow deposit for ${description || 'work'}`,
      amount: parseFloat(amount),
      type: 'escrow',
      status: 'completed',
      referenceId: escrowId,
      referenceType: 'escrow'
    });
    
    res.json({
      id: escrowId,
      message: 'Escrow funded successfully'
    });
    
  } catch (error) {
    console.error('Create escrow transaction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Release escrow funds
export async function releaseEscrowFunds(req, res) {
  try {
    const userId = req.user.id;
    const { transactionId } = req.params;
    
    console.log('Release escrow request:', { userId, transactionId });
    
    // Get the escrow transaction
    const escrowTransactions = await WalletModel.getEscrowTransactions(userId);
    const transaction = escrowTransactions.find(tx => tx.id === parseInt(transactionId));
    
    if (!transaction) {
      return res.status(404).json({ message: 'Escrow transaction not found' });
    }
    
    // Only the client can release funds
    if (transaction.client_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to release funds' });
    }
    
    // Check if the transaction is in the correct state
    if (!['funded', 'in_progress', 'completed'].includes(transaction.status)) {
      return res.status(400).json({ 
        message: 'Escrow funds can only be released from funded, in-progress, or completed status' 
      });
    }
    
    // Update the escrow status
    await WalletModel.updateEscrowStatus(transactionId, 'released');
    
    // Add the funds to the provider's wallet
    await WalletModel.updateBalance(transaction.provider_id, parseFloat(transaction.amount));
    
    // Record the transaction for the provider
    await WalletModel.addTransaction(transaction.provider_id, {
      description: `Payment received for ${transaction.title || 'work'}`,
      amount: parseFloat(transaction.amount),
      type: 'release',
      status: 'completed',
      referenceId: transaction.id,
      referenceType: 'escrow'
    });
    
    console.log('Escrow funds released successfully:', { transactionId, amount: transaction.amount });
    
    res.json({
      message: 'Escrow funds released successfully'
    });
    
  } catch (error) {
    console.error('Release escrow funds error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Dispute escrow funds
export async function disputeEscrowFunds(req, res) {
  try {
    const userId = req.user.id;
    const { transactionId } = req.params;
    const { reason } = req.body;
    
    console.log('Dispute escrow request:', { userId, transactionId, reason });
    
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Dispute reason is required' });
    }
    
    // Get the escrow transaction
    const escrowTransactions = await WalletModel.getEscrowTransactions(userId);
    const transaction = escrowTransactions.find(tx => tx.id === parseInt(transactionId));
    
    if (!transaction) {
      return res.status(404).json({ message: 'Escrow transaction not found' });
    }
    
    // Only the client can dispute funds
    if (transaction.client_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to dispute this transaction' });
    }
    
    // Check if the transaction is in the correct state
    if (!['funded', 'in_progress', 'completed'].includes(transaction.status)) {
      return res.status(400).json({ 
        message: 'Escrow funds can only be disputed from funded, in-progress, or completed status' 
      });
    }
    
    // Update the escrow status to disputed
    await WalletModel.updateEscrowStatus(transactionId, 'disputed');
    
    // Record the dispute reason in the transaction
    await WalletModel.addTransaction(userId, {
      description: `Dispute filed for ${transaction.title || 'work'}: ${reason}`,
      amount: parseFloat(transaction.amount),
      type: 'payment',
      status: 'pending',
      referenceId: transaction.id,
      referenceType: 'escrow'
    });
    
    console.log('Escrow dispute filed successfully:', { transactionId, reason });
    
    res.json({
      message: 'Dispute filed successfully. Our team will review your case.'
    });
    
  } catch (error) {
    console.error('Dispute escrow funds error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
