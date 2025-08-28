
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as walletController from '../controllers/walletController.js';

const router = express.Router();

// SSLCommerz callback routes (no auth middleware needed)
router.post('/sslcommerz/success', walletController.sslcommerzSuccess);
router.post('/sslcommerz/fail', walletController.sslcommerzFail);
router.post('/sslcommerz/cancel', walletController.sslcommerzCancel);
router.post('/sslcommerz/ipn', walletController.sslcommerzIPN);

// Apply auth middleware to all other wallet routes
router.use(authMiddleware);

// Wallet details
router.get('/details', walletController.getWalletDetails);

// SSLCommerz payment routes
router.post('/topup', walletController.initiateTopUp);
router.post('/withdraw', walletController.initiateWithdrawal);

// Legacy routes for backward compatibility
router.post('/topup-legacy', walletController.topUpWallet);
router.post('/withdraw-legacy', walletController.withdrawFromWallet);

// Payment methods
router.get('/payment-methods', walletController.getPaymentMethods);
router.post('/payment-methods', walletController.addPaymentMethod);
router.put('/payment-methods/:methodId/default', walletController.setDefaultPaymentMethod);
router.delete('/payment-methods/:methodId', walletController.deletePaymentMethod);

// Transactions
router.get('/transactions', walletController.getTransactions);

// Financial data endpoints
router.get('/financial-data', walletController.getFinancialData);
router.get('/expense-breakdown', walletController.getExpenseBreakdown);

// Savings goals
router.get('/savings-goals', walletController.getSavingsGoals);
router.post('/savings-goals', walletController.addSavingsGoal);
router.put('/savings-goals/:goalId', walletController.editSavingsGoal);
router.put('/savings-goals/:goalId/add-funds', walletController.updateSavingsGoal);
router.delete('/savings-goals/:goalId', walletController.deleteSavingsGoal);

// Escrow transactions
router.get('/escrow', walletController.getEscrowTransactions);
router.post('/escrow', walletController.createEscrowTransaction);
router.post('/escrow/payment', walletController.createEscrowWithPayment);
router.post('/escrow/:transactionId/release', walletController.releaseEscrowFunds);
router.post('/escrow/:transactionId/dispute', walletController.disputeEscrowFunds);
router.post('/escrow/:transactionId/in-progress', walletController.markEscrowInProgress);
router.post('/escrow/:transactionId/completed', walletController.markEscrowCompleted);

export default router;
