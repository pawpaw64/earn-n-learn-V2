
import InvoiceModel from '../models/invoiceModel.js';
import NotificationModel from '../models/notificationModel.js';

// Get user invoices
export const getUserInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceModel.getByUserId(req.user.id);
    res.json(invoices);
  } catch (error) {
    console.error('Get user invoices error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new invoice
export const createInvoice = async (req, res) => {
  const { client, title, amount, status, issued_date, due_date } = req.body;
  
  if (!client || !title || !amount) {
    return res.status(400).json({ message: 'Client, title, and amount are required' });
  }
  
  try {
    // Generate invoice number
    const invoiceNumber = await InvoiceModel.generateInvoiceNumber();
    
    // Create invoice
    const invoiceId = await InvoiceModel.create({
      user_id: req.user.id,
      invoice_number: invoiceNumber,
      client,
      title,
      amount,
      status: status || 'Pending',
      issued_date: issued_date || new Date(),
      due_date: due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Default due in 14 days
    });
    
    // Create notification for invoice creator
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Invoice Created',
      message: `You have created invoice #${invoiceNumber} for ${client}`,
      type: 'invoice',
      reference_id: invoiceId,
      reference_type: 'invoice'
    });
    
    res.status(201).json({
      message: 'Invoice created successfully',
      invoiceId,
      invoiceNumber
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update invoice status
export const updateInvoiceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const validStatuses = ['Pending', 'Paid', 'Overdue', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    // Get invoice
    const invoice = await InvoiceModel.getById(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Check authorization
    if (invoice.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this invoice' });
    }
    
    // Update status
    const updated = await InvoiceModel.updateStatus(id, status);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update invoice status' });
    }
    
    // Create notification
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Invoice Status Updated',
      message: `Invoice #${invoice.invoice_number} status has been updated to ${status}`,
      type: 'invoice_status',
      reference_id: parseInt(id),
      reference_type: 'invoice'
    });
    
    res.json({ 
      message: 'Invoice status updated successfully',
      status
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await InvoiceModel.getById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Check authorization
    if (invoice.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this invoice' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
