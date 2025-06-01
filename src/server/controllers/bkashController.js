
import BkashService from '../services/bkashService.js';
import BkashModel from '../models/bkashModel.js';
import WalletModel from '../models/walletModel.js';

// Initialize bKash payment
export async function initiateBkashPayment(req, res) {
  try {
    const userId = req.user.id;
    const { amount, purpose } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Generate unique merchant invoice number
    const merchantInvoiceNumber = `ELW-${userId}-${Date.now()}`;

    // Create payment with bKash
    const paymentResponse = await BkashService.createPayment(
      amount,
      merchantInvoiceNumber,
      'sale'
    );

    if (!paymentResponse.paymentID) {
      return res.status(400).json({ message: 'Failed to create bKash payment' });
    }

    // Store transaction in database
    await BkashModel.createBkashTransaction({
      userId,
      paymentId: paymentResponse.paymentID,
      merchantInvoiceNumber,
      amount: parseFloat(amount),
      currency: 'BDT',
      intent: 'sale',
      paymentStatus: 'Initiated',
      transactionStatus: 'Initiated'
    });

    res.json({
      success: true,
      paymentID: paymentResponse.paymentID,
      bkashURL: paymentResponse.bkashURL,
      amount: amount,
      merchantInvoiceNumber
    });

  } catch (error) {
    console.error('bKash initiate payment error:', error);
    res.status(500).json({ 
      message: 'Failed to initiate bKash payment', 
      error: error.message 
    });
  }
}

// Execute bKash payment after user approval
export async function executeBkashPayment(req, res) {
  try {
    const userId = req.user.id;
    const { paymentID } = req.body;

    if (!paymentID) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // Execute payment with bKash
    const executeResponse = await BkashService.executePayment(paymentID);

    if (executeResponse.transactionStatus !== 'Completed') {
      return res.status(400).json({ 
        message: 'Payment execution failed',
        status: executeResponse.transactionStatus 
      });
    }

    // Update bKash transaction record
    await BkashModel.updateBkashTransaction(paymentID, {
      trxId: executeResponse.trxID,
      paymentStatus: executeResponse.paymentStatus,
      transactionStatus: executeResponse.transactionStatus,
      customerMsisdn: executeResponse.customerMsisdn,
      paymentExecuteTime: new Date(executeResponse.paymentExecuteTime)
    });

    // Get the transaction to update wallet
    const bkashTransaction = await BkashModel.getBkashTransactionByPaymentId(paymentID);
    
    if (bkashTransaction && bkashTransaction.user_id === userId) {
      // Update wallet balance
      await WalletModel.updateBalance(userId, parseFloat(bkashTransaction.amount));
      
      // Record the transaction in wallet
      await WalletModel.addTransaction(userId, {
        description: `bKash top up - ${executeResponse.trxID}`,
        amount: parseFloat(bkashTransaction.amount),
        type: 'deposit',
        status: 'completed',
        referenceId: executeResponse.trxID,
        referenceType: 'bkash'
      });
    }

    res.json({
      success: true,
      transactionStatus: executeResponse.transactionStatus,
      trxID: executeResponse.trxID,
      amount: bkashTransaction.amount
    });

  } catch (error) {
    console.error('bKash execute payment error:', error);
    res.status(500).json({ 
      message: 'Failed to execute bKash payment', 
      error: error.message 
    });
  }
}

// Query bKash payment status
export async function queryBkashPayment(req, res) {
  try {
    const { paymentID } = req.params;

    if (!paymentID) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const queryResponse = await BkashService.queryPayment(paymentID);

    res.json({
      success: true,
      ...queryResponse
    });

  } catch (error) {
    console.error('bKash query payment error:', error);
    res.status(500).json({ 
      message: 'Failed to query bKash payment', 
      error: error.message 
    });
  }
}

// Add bKash as payment method
export async function addBkashPaymentMethod(req, res) {
  try {
    const userId = req.user.id;
    const { bkashNumber } = req.body;

    if (!bkashNumber || !/^01[3-9]\d{8}$/.test(bkashNumber)) {
      return res.status(400).json({ message: 'Invalid bKash number format' });
    }

    // Add bKash payment method
    const methodId = await BkashModel.addBkashPaymentMethod(userId, bkashNumber);

    res.json({
      success: true,
      id: methodId,
      message: 'bKash payment method added successfully'
    });

  } catch (error) {
    console.error('Add bKash payment method error:', error);
    res.status(500).json({ 
      message: 'Failed to add bKash payment method', 
      error: error.message 
    });
  }
}

// Process bKash withdrawal
export async function processBkashWithdrawal(req, res) {
  try {
    const userId = req.user.id;
    const { amount, bkashNumber } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!bkashNumber) {
      return res.status(400).json({ message: 'bKash number is required' });
    }

    // Check wallet balance
    const wallet = await WalletModel.getWallet(userId);
    if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // For withdrawals, we'll simulate the process since bKash refund requires original payment
    // In a real implementation, you'd integrate with bKash refund API properly
    
    // Deduct from wallet first
    await WalletModel.updateBalance(userId, -parseFloat(amount));
    
    // Record the withdrawal transaction
    await WalletModel.addTransaction(userId, {
      description: `bKash withdrawal to ${bkashNumber}`,
      amount: parseFloat(amount),
      type: 'withdrawal',
      status: 'completed',
      referenceId: `WD-${Date.now()}`,
      referenceType: 'bkash'
    });

    res.json({
      success: true,
      message: 'Withdrawal processed successfully',
      amount: amount,
      bkashNumber: bkashNumber
    });

  } catch (error) {
    console.error('bKash withdrawal error:', error);
    res.status(500).json({ 
      message: 'Failed to process bKash withdrawal', 
      error: error.message 
    });
  }
}
