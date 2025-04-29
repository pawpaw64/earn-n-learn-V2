
import { execute } from '../config/db.js';
// Helper function to format Date

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';
}

class JobModel {
  // Unified method to handle query results
  static async #handleQueryResult(result) {
    // Handle cases where result is already the rows array
    if (Array.isArray(result)) {
      return result;
    }
    
    // Handle cases where result is an object with rows/first result set at index 0
    if (result && Array.isArray(result[0])) {
      return result[0];
    }
    
    // Handle cases where result is [rows, fields] array
    if (Array.isArray(result) && result.length === 2 && Array.isArray(result[0])) {
      return result[0];
    }
    
    console.error('Unexpected query result format:', result);
    return [];
  }

  // Get all jobs
  static async getAll() {
    try {
      const result = await execute(`
        SELECT 
          j.id, j.title, j.type, j.description, j.payment,
          j.location, j.deadline, j.requirements, j.created_at,
          u.name as poster, 
          u.email as posterEmail, 
          u.avatar as posterAvatar
        FROM jobs j
        JOIN users u ON j.user_id = u.id
        ORDER BY j.created_at DESC
      `);
      
      const rows = await this.#handleQueryResult(result);
      
      return rows.map(row => ({
        ...row,
        deadline: formatDate(row.deadline),
      }));
    } catch (error) {
      console.error('Database error in getAll:', error);
      throw new Error('Failed to fetch jobs');
    }
  }
  static async create(jobData) {
    try {
      // Execute the insert query
      const result = await execute(
        `INSERT INTO jobs 
        (user_id, title, description, type, payment, deadline, requirements, location, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          jobData.user_id,
          jobData.title,
          jobData.description,
          jobData.type,
          jobData.payment,
          jobData.deadline,
          jobData.requirements,
          jobData.location,
          jobData.status || 'Active'
        ]
      );

      // Handle different result formats
      let insertId;
      if (Array.isArray(result)) {
        // For array results (like [result, fields])
        insertId = result[0]?.insertId;
      } else if (result?.insertId) {
        // For object results
        insertId = result.insertId;
      }

      if (!insertId) {
        throw new Error('No insert ID returned from database');
      }

      // Fetch the created job
      const [createdJob] = await execute(
        'SELECT * FROM jobs WHERE id = ?',
        [insertId]
      );

      if (!createdJob || createdJob.length === 0) {
        throw new Error('Failed to fetch created job');
      }

      return createdJob[0];
    } catch (error) {
      console.error('Job creation failed:', {
        error: error.message,
        stack: error.stack,
        jobData: {
          ...jobData,
          description: jobData.description?.substring(0, 50) + '...',
          requirements: jobData.requirements?.substring(0, 50) + '...'
        },
        timestamp: new Date().toISOString()
      });
      throw new Error('Failed to create job');
    }
  }
  static async getByUserId(userId) {
    try {
      const result = await execute(
        `SELECT j.*, u.name as poster_name, u.avatar as poster_avatar
         FROM jobs j
         JOIN users u ON j.user_id = u.id
         WHERE j.user_id = ?`,
        [userId]
      );
      
      const rows = await this.#handleQueryResult(result);
      return rows;
    } catch (error) {
      console.error('Error in getByUserId:', error);
      throw error;
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
