
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

// Savings goals
router.get('/savings-goals', walletController.getSavingsGoals);
router.post('/savings-goals', walletController.addSavingsGoal);
router.put('/savings-goals/:goalId', walletController.updateSavingsGoal);

// Escrow transactions
router.get('/escrow', walletController.getEscrowTransactions);
router.post('/escrow', walletController.createEscrowTransaction);
router.post('/escrow/:transactionId/release', walletController.releaseEscrowFunds);

export default router;
