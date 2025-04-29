
import { execute } from '../config/db.js';

class ApplicationModel {
  // Get all applications (admin only)
  static async getAll() {
    const [rows] = await execute(`
      SELECT a.*, j.title as job_title, j.type as job_type, 
      u.name as applicant_name, u.email as applicant_email,
      p.name as poster_name, p.email as poster_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      JOIN users p ON j.user_id = p.id
      ORDER BY a.created_at DESC
    `);
    return rows;
  }

  // Get application by ID
  static async getById(id) {
    const [rows] = await execute(`
      SELECT a.*, j.title as job_title, j.type as job_type, j.description as job_description,
      j.payment, j.deadline, j.requirements, j.location,
      u.name as applicant_name, u.email as applicant_email, u.avatar as applicant_avatar,
      p.name as poster_name, p.email as poster_email, p.avatar as poster_avatar
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      JOIN users p ON j.user_id = p.id
      WHERE a.id = ?
    `, [id]);
    return rows[0];
  }

  // Create new application
  static async create(applicationData) {
    const { job_id, user_id, cover_letter } = applicationData;
    
    const [result] = await execute(
      'INSERT INTO applications (job_id, user_id, cover_letter) VALUES (?, ?, ?)',
      [job_id, user_id, cover_letter]
    );
    
    return result.insertId;
  }

  // Update application status
  static async updateStatus(id, status) {
    const [result] = await execute(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }

  // Get applications by user ID (applicant)
  static async getByUserId(userId) {
    const [rows] = await execute(`
      SELECT a.*, j.title, j.type, j.payment, j.deadline, j.location,
      u.name as poster_name, u.email as poster_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON j.user_id = u.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `, [userId]);
    return rows;
  }

  // Get applications to user's jobs (poster)
  static async getToUserJobs(userId) {
    const [rows] = await execute(`
      SELECT a.*, j.title, j.type, j.payment,
      u.name as applicant_name, u.email as applicant_email, u.avatar as applicant_avatar
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      WHERE j.user_id = ?
      ORDER BY a.created_at DESC
    `, [userId]);
    return rows;
  }

  // Check if user has already applied for a job
  static async checkDuplicate(jobId, userId) {
    const [rows] = await execute(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
      [jobId, userId]
    );
    return rows.length > 0;
  }
}

export default ApplicationModel;
