
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as bkashController from '../controllers/bkashController.js';

const router = express.Router();

// Apply auth middleware to all bKash routes
router.use(authMiddleware);

// bKash payment routes
router.post('/initiate-payment', bkashController.initiateBkashPayment);
router.post('/execute-payment', bkashController.executeBkashPayment);
router.get('/query-payment/:paymentID', bkashController.queryBkashPayment);

// bKash payment method routes
router.post('/add-payment-method', bkashController.addBkashPaymentMethod);

// bKash withdrawal routes
router.post('/withdraw', bkashController.processBkashWithdrawal);

export default router;
