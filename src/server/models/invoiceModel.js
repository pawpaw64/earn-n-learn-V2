
import { execute } from '../config/db.js';

class InvoiceModel {
  // Create new invoice
  static async create(invoiceData) {
    const { user_id, invoice_number, client, title, amount, status, issued_date, due_date } = invoiceData;
    
    const [result] = await execute(
      'INSERT INTO invoices (user_id, invoice_number, client, title, amount, status, issued_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, invoice_number, client, title, amount, status, issued_date, due_date]
    );
    
    return result.insertId;
  }

  // Generate invoice number
  static async generateInvoiceNumber() {
    // Get current year
    const year = new Date().getFullYear().toString().substr(2, 2);
    
    // Get latest invoice number for this year
    const [rows] = await execute(
      "SELECT invoice_number FROM invoices WHERE invoice_number LIKE ? ORDER BY id DESC LIMIT 1",
      [`INV-${year}%`]
    );
    
    let sequenceNumber = 1;
    if (rows && rows[0]) {
      // Parse the last sequence number and increment
      const lastInvoiceNumber = rows[0].invoice_number;
      const lastSequence = parseInt(lastInvoiceNumber.split('-')[2]);
      sequenceNumber = isNaN(lastSequence) ? 1 : lastSequence + 1;
    }
    
    // Format the sequence number with leading zeros
    const sequence = sequenceNumber.toString().padStart(4, '0');
    
    return `INV-${year}-${sequence}`;
  }

  // Create invoice from completed work
  static async createFromWork(workId, amount) {
    const work = await execute(`
      SELECT 
        wa.*,
        j.title as job_title, j.payment as job_payment,
        sm.skill_name as skill_title, sm.pricing as skill_payment,
        mm.title as material_title, mm.price as material_payment,
        p.id as provider_id, p.name as provider_name,
        c.id as client_id, c.name as client_name
      FROM work_assignments wa
      LEFT JOIN jobs j ON wa.job_id = j.id
      LEFT JOIN skill_marketplace sm ON wa.skill_id = sm.id
      LEFT JOIN material_marketplace mm ON wa.material_id = mm.id
      JOIN users p ON wa.provider_id = p.id
      JOIN users c ON wa.client_id = c.id
      WHERE wa.id = ?
    `, [workId]);
    
    if (!work || !work[0] || !work[0][0]) {
      throw new Error('Work assignment not found');
    }
    
    const workData = work[0][0];
    const title = workData.job_title || workData.skill_title || workData.material_title;
    const suggestedAmount = workData.job_payment || workData.skill_payment || workData.material_payment;
    
    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber();
    
    // Determine the final amount to use
    const finalAmount = amount || parseFloat(suggestedAmount.replace(/[^0-9.]/g, '')) || 0;
    
    // Create the invoice (provider is the one who gets paid)
    const invoiceData = {
      user_id: workData.provider_id,
      invoice_number: invoiceNumber,
      client: workData.client_name,
      title: `Payment for: ${title}`,
      amount: finalAmount,
      status: 'Pending',
      issued_date: new Date(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Due in 14 days
    };
    
    return this.create(invoiceData);
  }

  // Get user invoices
  static async getByUserId(userId) {
    const [rows] = await execute(
      'SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    return rows;
  }

  // Update invoice status
  static async updateStatus(id, status) {
    const [result] = await execute(
      'UPDATE invoices SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }

  // Get invoice by ID
  static async getById(id) {
    const [rows] = await execute(
      'SELECT * FROM invoices WHERE id = ?',
      [id]
    );
    
    return rows[0];
  }
}

export default InvoiceModel;
