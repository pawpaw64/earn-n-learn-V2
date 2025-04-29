
import { Router } from 'express';
const router = Router();
import {
  getUserInvoices,
  createInvoice,
  updateInvoiceStatus,
  getInvoiceById
} from '../controllers/invoiceController.js';
import auth from '../middleware/authMiddleware.js';

// All routes need authentication
router.use(auth);

// Get user invoices
router.get('/', getUserInvoices);

// Create new invoice
router.post('/', createInvoice);

// Get invoice by ID
router.get('/:id', getInvoiceById);

// Update invoice status
router.put('/:id/status', updateInvoiceStatus);

export default router;
