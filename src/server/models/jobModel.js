
import { execute } from '../config/db.js';

class JobModel {
  // Get all jobs
  static async getAll() {
    try {
      const [rows] = await execute(`
        SELECT j.*, u.name as poster_name, u.avatar as poster_avatar
        FROM jobs j
        JOIN users u ON j.user_id = u.id
        ORDER BY j.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get job by ID
  static async getById(id) {
    try {
      const [rows] = await execute(`
        SELECT j.*, u.name as poster_name, u.avatar as poster_avatar, u.email as poster_email
        FROM jobs j
        JOIN users u ON j.user_id = u.id
        WHERE j.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create job
  static async create(jobData) {
    const { title, description, type, payment, deadline, requirements, location, user_id } = jobData;
    
    try {
      const [result] = await execute(
        'INSERT INTO jobs (title, description, type, payment, deadline, requirements, location, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, type, payment, deadline, requirements, location, user_id]
      );
      
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update job
  static async update(id, jobData) {
    const { title, description, type, payment, deadline, requirements, location, status } = jobData;
    
    try {
      const [result] = await execute(
        'UPDATE jobs SET title = ?, description = ?, type = ?, payment = ?, deadline = ?, requirements = ?, location = ?, status = ? WHERE id = ?',
        [title, description, type, payment, deadline, requirements, location, status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete job
  static async delete(id) {
    try {
      const [result] = await execute('DELETE FROM jobs WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user jobs
  static async getUserJobs(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM jobs WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default JobModel;
