
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as walletController from '../controllers/walletController.js';

const router = express.Router();

// Apply auth middleware to all wallet routes
router.use(authMiddleware);

// Wallet details
router.get('/details', walletController.getWalletDetails);

// Top up and withdraw
router.post('/topup', walletController.topUpWallet);
router.post('/withdraw', walletController.withdrawFromWallet);

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
router.post('/escrow/:transactionId/release', walletController.releaseEscrowFunds);
router.post('/escrow/:transactionId/dispute', walletController.disputeEscrowFunds);

export default router;
