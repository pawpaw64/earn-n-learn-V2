
import WalletModel from '../models/walletModel.js';
import UserModel from '../models/userModel.js';

// Get wallet details
export async function getWalletDetails(req, res) {
  try {
    const userId = req.user.id;
    
    // Get wallet, if doesn't exist, create one
    let wallet = await WalletModel.getWallet(userId);
    if (!wallet) {
      await WalletModel.createWallet(userId);
      wallet = { id: null, user_id: userId, balance: 0 };
    }
    
    // Get current month's financials
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const financials = await WalletModel.getMonthlyFinancials(userId, year, month);
    
    // Get escrow balance (sum of all in-progress escrow transactions)
    const escrowTransactions = await WalletModel.getEscrowTransactions(userId);
    const pendingEscrow = escrowTransactions
      .filter(tx => tx.status === 'in_progress' && tx.provider_id === userId)
      .reduce((total, tx) => total + parseFloat(tx.amount), 0);
    
    // Get a sample savings goal
    const savingsGoals = await WalletModel.getSavingsGoals(userId);
    const savingsProgress = savingsGoals.length > 0 
      ? Math.round((savingsGoals[0].current_amount / savingsGoals[0].target_amount) * 100)
      : 0;
    
    res.json({
      balance: wallet.balance,
      pendingEscrow,
      monthlyEarnings: financials.earnings,
      monthlySpending: financials.spending,
      savingsProgress
    });
    
  } catch (error) {
    console.error('Get wallet details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Top up wallet
export async function topUpWallet(req, res) {
  try {
    const userId = req.user.id;
    const { amount, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // In a real app, this would call a payment processor API
    // For now, we'll simulate a successful payment
    
    // Update the wallet balance
    await WalletModel.updateBalance(userId, amount);
    
    // Record the transaction
    await WalletModel.addTransaction(userId, {
      description: `Top up via ${paymentMethod || 'card'}`,
      amount,
      type: 'deposit',
      status: 'completed'
    });
    
    // Get the updated wallet
    const wallet = await WalletModel.getWallet(userId);
    
    res.json({
      message: 'Top up successful',
      balance: wallet.balance
    });
    
  } catch (error) {
    console.error('Top up wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Withdraw from wallet
export async function withdrawFromWallet(req, res) {
  try {
    const userId = req.user.id;
    const { amount, withdrawMethod } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Check if user has enough balance
    const wallet = await WalletModel.getWallet(userId);
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Update the wallet balance (subtract the amount)
    await WalletModel.updateBalance(userId, -amount);
    
    // Record the transaction
    await WalletModel.addTransaction(userId, {
      description: `Withdrawal to ${withdrawMethod || 'bank account'}`,
      amount,
      type: 'withdrawal',
      status: 'completed'
    });
    
    // Get the updated wallet
    const updatedWallet = await WalletModel.getWallet(userId);
    
    res.json({
      message: 'Withdrawal successful',
      balance: updatedWallet.balance
    });
    
  } catch (error) {
    console.error('Withdraw from wallet error:', error);
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
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
    res.status(500).json({ message: 'Server error' });
  }
}

// Get savings goals
export async function getSavingsGoals(req, res) {
  try {
    const userId = req.user.id;
    const goals = await WalletModel.getSavingsGoals(userId);
    
    // Transform the database format to the frontend format
    const transformedGoals = goals.map(goal => ({
      id: goal.id,
      name: goal.name,
      targetAmount: parseFloat(goal.target_amount),
      currentAmount: parseFloat(goal.current_amount),
      deadline: goal.deadline,
      progress: Math.round((goal.current_amount / goal.target_amount) * 100)
    }));
    
    res.json(transformedGoals);
    
  } catch (error) {
    console.error('Get savings goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Add savings goal
export async function addSavingsGoal(req, res) {
  try {
    const userId = req.user.id;
    const { name, targetAmount, deadline } = req.body;
    
    if (!name || !targetAmount || targetAmount <= 0) {
      return res.status(400).json({ message: 'Invalid savings goal details' });
    }
    
    // Add the savings goal
    const goalId = await WalletModel.addSavingsGoal(userId, {
      name,
      targetAmount,
      currentAmount: 0,
      deadline
    });
    
    res.json({
      id: goalId,
      message: 'Savings goal added successfully'
    });
    
  } catch (error) {
    console.error('Add savings goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update savings goal (add money to it)
export async function updateSavingsGoal(req, res) {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Check if user has enough balance
    const wallet = await WalletModel.getWallet(userId);
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Update the wallet balance (subtract the amount)
    await WalletModel.updateBalance(userId, -amount);
    
    // Update the savings goal
    const success = await WalletModel.updateSavingsGoal(userId, goalId, amount);
    
    if (!success) {
      // Rollback the wallet balance update
      await WalletModel.updateBalance(userId, amount);
      return res.status(404).json({ message: 'Savings goal not found' });
    }
    
    // Record the transaction
    await WalletModel.addTransaction(userId, {
      description: 'Transfer to savings goal',
      amount,
      type: 'payment',
      status: 'completed'
    });
    
    res.json({
      message: 'Savings goal updated successfully'
    });
    
  } catch (error) {
    console.error('Update savings goal error:', error);
    res.status(500).json({ message: 'Server error' });
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
      title: tx.title,
      jobType: tx.job_type,
      amount: parseFloat(tx.amount),
      status: tx.status,
      clientName: tx.client_name,
      clientEmail: tx.client_email,
      createdAt: tx.created_at,
      updatedAt: tx.updated_at,
      description: tx.description,
      isProvider: tx.provider_id === userId
    }));
    
    res.json(transformedTransactions);
    
  } catch (error) {
    console.error('Get escrow transactions error:', error);
    res.status(500).json({ message: 'Server error' });
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
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Deduct from client's wallet
    await WalletModel.updateBalance(clientId, -amount);
    
    // Create the escrow transaction
    const escrowId = await WalletModel.createEscrowTransaction({
      jobId, 
      skillId, 
      materialId, 
      providerId, 
      clientId, 
      amount, 
      status: 'funded',
      description
    });
    
    // Record the transaction
    await WalletModel.addTransaction(clientId, {
      description: `Escrow deposit for ${description || 'work'}`,
      amount,
      type: 'escrow',
      status: 'completed',
      reference_id: escrowId,
      reference_type: 'escrow'
    });
    
    res.json({
      id: escrowId,
      message: 'Escrow funded successfully'
    });
    
  } catch (error) {
    console.error('Create escrow transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Release escrow funds
export async function releaseEscrowFunds(req, res) {
  try {
    const userId = req.user.id;
    const { transactionId } = req.params;
    
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
    if (transaction.status !== 'funded' && transaction.status !== 'in_progress') {
      return res.status(400).json({ 
        message: 'Escrow funds can only be released from funded or in-progress status' 
      });
    }
    
    // Update the escrow status
    await WalletModel.updateEscrowStatus(transactionId, 'released');
    
    // Add the funds to the provider's wallet
    await WalletModel.updateBalance(transaction.provider_id, transaction.amount);
    
    // Record the transaction for the provider
    await WalletModel.addTransaction(transaction.provider_id, {
      description: `Payment received for ${transaction.title || 'work'}`,
      amount: transaction.amount,
      type: 'release',
      status: 'completed',
      reference_id: transaction.id,
      reference_type: 'escrow'
    });
    
    res.json({
      message: 'Escrow funds released successfully'
    });
    
  } catch (error) {
    console.error('Release escrow funds error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
