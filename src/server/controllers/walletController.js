
import WalletModel from '../models/walletModel.js';

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
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const financials = await WalletModel.getMonthlyFinancials(userId, year, month);
    
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
      monthlyEarnings: financials.earnings,
      monthlySpending: financials.spending,
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
    res.status(500).json({ message: 'Server error', error: error.message });
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
    
    // Record the transaction
    await WalletModel.addTransaction(userId, {
      description: 'Transfer to savings goal',
      amount: parseFloat(amount),
      type: 'payment',
      status: 'completed'
    });
    
    res.json({
      message: 'Savings goal updated successfully'
    });
    
  } catch (error) {
    console.error('Update savings goal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
export async function updateEscrowProgress(req, res) {
  try {
    const userId = req.user.id;
    const { transactionId } = req.params;
    const { status, notes } = req.body;
    
    console.log('Update escrow progress request:', { userId, transactionId, status, notes });
    
    // Get the escrow transaction
    const escrowTransactions = await WalletModel.getEscrowTransactions(userId);
    const transaction = escrowTransactions.find(tx => tx.id === parseInt(transactionId));
    
    if (!transaction) {
      return res.status(404).json({ message: 'Escrow transaction not found' });
    }
    
    // Only the provider can update progress
    if (transaction.provider_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update progress' });
    }
    
    // Valid status transitions
    const validStatuses = ['in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Update the progress
    await WalletModel.updateEscrowProgress(transactionId, status, notes);
    
    console.log('Escrow progress updated successfully:', { transactionId, status });
    
    res.json({
      message: 'Progress updated successfully'
    });
    
  } catch (error) {
    console.error('Update escrow progress error:', error);
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
// Accept escrow transaction
export async function acceptEscrowTransaction(req, res) {
  try {
    const userId = req.user.id;
    const { transactionId } = req.params;
    
    console.log('Accept escrow request:', { userId, transactionId });
    
    // Get the escrow transaction
    const escrowTransactions = await WalletModel.getEscrowTransactions(userId);
    const transaction = escrowTransactions.find(tx => tx.id === parseInt(transactionId));
    
    if (!transaction) {
      return res.status(404).json({ message: 'Escrow transaction not found' });
    }
    
    // Only the provider can accept
    if (transaction.provider_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to accept this transaction' });
    }
    
    // Check if the transaction is in the correct state
    if (transaction.status !== 'pending_acceptance') {
      return res.status(400).json({ 
        message: 'Transaction is not in pending acceptance state' 
      });
    }
    
    // Accept the escrow transaction
    await WalletModel.acceptEscrowTransaction(transactionId, userId);
    
    console.log('Escrow transaction accepted successfully:', { transactionId });
    
    res.json({
      message: 'Escrow transaction accepted successfully'
    });
    
  } catch (error) {
    console.error('Accept escrow transaction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
export async function createEscrowTransaction(req, res) {
  try {
    const userId = req.user.id;
    const { providerId, jobId, skillId, materialId, amount, description } = req.body;
    
    console.log('Create escrow request:', { userId, providerId, jobId, skillId, materialId, amount });
    
    if (!providerId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Provider ID and valid amount are required' });
    }
    
    // Check if user has sufficient balance (in real implementation, this would be handled by payment processing)
    const wallet = await WalletModel.getWallet(userId);
    if (!wallet || wallet.balance < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Create the escrow transaction
    const escrowId = await WalletModel.createEscrowTransaction({
      jobId,
      skillId,
      materialId,
      providerId,
      clientId: userId,
      amount: parseFloat(amount),
      description
    });
    
    // Deduct amount from client's wallet
    await WalletModel.updateBalance(userId, -parseFloat(amount));
    
    // Record the transaction
    await WalletModel.addTransaction(userId, {
      description: `Escrow payment created for ${description || 'work'}`,
      amount: parseFloat(amount),
      type: 'escrow',
      status: 'completed',
      referenceId: escrowId,
      referenceType: 'escrow'
    });
    
    console.log('Escrow transaction created successfully:', { escrowId });
    
    res.status(201).json({
      message: 'Escrow transaction created successfully',
      escrowId
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
