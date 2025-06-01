
import BkashService from '../services/bkashService.js';
import BkashModel from '../models/bkashModel.js';
import WalletModel from '../models/walletModel.js';

// Create bKash payment for top-up
export async function createPayment(req, res) {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Generate unique merchant invoice number
    const merchantInvoiceNumber = `TOPUP_${userId}_${Date.now()}`;

    // Create payment with bKash
    const paymentResult = await BkashService.createPayment(amount, merchantInvoiceNumber);

    if (!paymentResult.success) {
      return res.status(400).json({ 
        message: 'Failed to create bKash payment',
        error: paymentResult.error 
      });
    }

    // Store transaction in database
    await BkashModel.createTransaction({
      userId,
      paymentId: paymentResult.paymentID,
      amount: parseFloat(amount),
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber,
      paymentType: 'topup',
      status: 'created',
      bkashStatus: paymentResult.transactionStatus
    });

    res.json({
      success: true,
      paymentID: paymentResult.paymentID,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      merchantInvoiceNumber: paymentResult.merchantInvoiceNumber
    });

  } catch (error) {
    console.error('Create bKash payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Execute bKash payment
export async function executePayment(req, res) {
  try {
    const userId = req.user.id;
    const { paymentID } = req.body;

    if (!paymentID) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // Check if transaction exists and belongs to user
    const transaction = await BkashModel.getTransactionByPaymentId(paymentID);
    if (!transaction || transaction.user_id !== userId) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Execute payment with bKash
    const executeResult = await BkashService.executePayment(paymentID);

    if (!executeResult.success) {
      // Update transaction status to failed
      await BkashModel.updateTransaction(paymentID, {
        status: 'failed',
        bkashStatus: 'failed'
      });

      return res.status(400).json({ 
        message: 'Payment execution failed',
        error: executeResult.error 
      });
    }

    // Payment successful, update wallet balance
    if (transaction.payment_type === 'topup') {
      // Ensure wallet exists
      let wallet = await WalletModel.getWallet(userId);
      if (!wallet) {
        await WalletModel.createWallet(userId);
      }

      // Update wallet balance
      await WalletModel.updateBalance(userId, parseFloat(transaction.amount));

      // Create wallet transaction record
      const walletTransactionId = await WalletModel.addTransaction(userId, {
        description: `bKash top-up - ${executeResult.trxID}`,
        amount: parseFloat(transaction.amount),
        type: 'deposit',
        status: 'completed',
        referenceId: transaction.id,
        referenceType: 'bkash'
      });

      // Update bKash transaction
      await BkashModel.updateTransaction(paymentID, {
        trxId: executeResult.trxID,
        status: 'completed',
        bkashStatus: executeResult.transactionStatus,
        walletTransactionId
      });
    }

    res.json({
      success: true,
      paymentID: executeResult.paymentID,
      trxID: executeResult.trxID,
      amount: executeResult.amount,
      transactionStatus: executeResult.transactionStatus,
      message: 'Payment completed successfully'
    });

  } catch (error) {
    console.error('Execute bKash payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Query payment status
export async function queryPayment(req, res) {
  try {
    const userId = req.user.id;
    const { paymentID } = req.params;

    // Check if transaction belongs to user
    const transaction = await BkashModel.getTransactionByPaymentId(paymentID);
    if (!transaction || transaction.user_id !== userId) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Query payment status from bKash
    const queryResult = await BkashService.queryPayment(paymentID);

    if (!queryResult.success) {
      return res.status(400).json({ 
        message: 'Payment query failed',
        error: queryResult.error 
      });
    }

    res.json({
      success: true,
      data: queryResult.data
    });

  } catch (error) {
    console.error('Query bKash payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get user bKash transactions
export async function getUserTransactions(req, res) {
  try {
    const userId = req.user.id;
    const transactions = await BkashModel.getUserTransactions(userId);

    res.json(transactions);

  } catch (error) {
    console.error('Get user bKash transactions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Add bKash account
export async function addAccount(req, res) {
  try {
    const userId = req.user.id;
    const { accountNumber, accountHolderName, isDefault } = req.body;

    if (!accountNumber) {
      return res.status(400).json({ message: 'Account number is required' });
    }

    // Validate Bangladesh phone number format
    const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
    if (!phoneRegex.test(accountNumber)) {
      return res.status(400).json({ message: 'Invalid bKash account number format' });
    }

    const accountId = await BkashModel.addAccount(userId, {
      accountNumber,
      accountHolderName,
      isDefault: isDefault || false
    });

    res.json({
      success: true,
      accountId,
      message: 'bKash account added successfully'
    });

  } catch (error) {
    console.error('Add bKash account error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get user bKash accounts
export async function getUserAccounts(req, res) {
  try {
    const userId = req.user.id;
    const accounts = await BkashModel.getUserAccounts(userId);

    res.json(accounts);

  } catch (error) {
    console.error('Get user bKash accounts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Update account default status
export async function updateAccountDefault(req, res) {
  try {
    const userId = req.user.id;
    const { accountId } = req.params;

    const success = await BkashModel.updateAccountDefault(userId, accountId);

    if (!success) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({
      success: true,
      message: 'Default account updated successfully'
    });

  } catch (error) {
    console.error('Update bKash account default error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Delete bKash account
export async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;
    const { accountId } = req.params;

    const success = await BkashModel.deleteAccount(userId, accountId);

    if (!success) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({
      success: true,
      message: 'bKash account deleted successfully'
    });

  } catch (error) {
    console.error('Delete bKash account error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
