
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as bkashController from '../controllers/bkashController.js';

const router = express.Router();

// Apply auth middleware to all bKash routes
router.use(authMiddleware);

// Payment routes
router.post('/create-payment', bkashController.createPayment);
router.post('/execute-payment', bkashController.executePayment);
router.get('/query-payment/:paymentID', bkashController.queryPayment);
router.get('/transactions', bkashController.getUserTransactions);

// Account management routes
router.post('/accounts', bkashController.addAccount);
router.get('/accounts', bkashController.getUserAccounts);
router.put('/accounts/:accountId/default', bkashController.updateAccountDefault);
router.delete('/accounts/:accountId', bkashController.deleteAccount);

export default router;
