import { execute } from '../config/db.js';

class ApplicationModel {
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
    const result= await execute(`
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
    
   const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    return rows;
  }

  // Create new application
  static async create(applicationData) {
    // Validate input
    if (!applicationData || typeof applicationData !== 'object') {
      throw new Error('Invalid application data');
    }
  
    const { job_id, user_id, cover_letter } = applicationData;
    
    // Validate required fields
    if (!job_id || !user_id || !cover_letter) {
      throw new Error('Missing required application fields');
    }
  
    try {
      const result = await execute(
        'INSERT INTO applications (job_id, user_id, cover_letter) VALUES (?, ?, ?)',
        [job_id, user_id, cover_letter]
      );
      
      // Handle different result formats
      const insertId = Array.isArray(result) ? 
        (result[0]?.insertId || result.insertId) : 
        result.insertId;
      
      return insertId;
    } catch (error) {
      console.error('ApplicationModel.create() - Error:', error);
      throw error;
    }
  }
  // Get applications by user ID (applicant)
static async getByUserId(userId) {
  try {
    const result = await execute(`
      SELECT a.*, j.title, j.type, j.payment, j.deadline, j.location,
      u.name as poster_name, u.email as poster_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON j.user_id = u.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
    `, [userId]);
    
    // Handle different result formats
    const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    
    // console.debug('ApplicationModel.getByUserId() - Result', { rows });
    return rows;
  } catch (error) {
    console.error('ApplicationModel.getByUserId() - Error', {
      userId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// In getToUserJobs()
static async getToUserJobs(userId) {
  try {
    const result = await execute(`
      SELECT a.*, j.title, j.type, j.payment,
      u.name as applicant_name, u.email as applicant_email, u.avatar as applicant_avatar
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      WHERE j.user_id = ?
      ORDER BY a.created_at DESC
    `, [userId]);
    
    // Handle different result formats
    const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    
    // console.debug('ApplicationModel.getToUserJobs() - Result',);
    return rows;
  } catch (error) {
    console.error('ApplicationModel.getToUserJobs() - Error', {
      userId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

  // Get applications by job ID
static async getByJobId(jobId) {
  try {
    const result = `
      SELECT 
        a.*, 
        u.name as applicant_name, 
        u.email as applicant_email, 
        u.avatar as applicant_avatar,
        u.bio as applicant_bio,
        u.university as applicant_university,
        j.title as job_title
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN jobs j ON a.job_id = j.id
      WHERE a.job_id = ?
      ORDER BY a.created_at DESC
    `;
    
   const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    return rows;
    
  } catch (error) {
    console.error('ApplicationModel.getByJobId() - Error', {
      jobId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

  // Check if user has already applied for a job
  static async checkDuplicate(jobId, userId) {
    const [rows] = await execute(
      'SELECT id FROM applications WHERE job_id = ? AND user_id = ?',
      [jobId, userId]
    );
    return rows;
  }
}

export default ApplicationModel;