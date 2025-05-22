
import { execute } from '../config/db.js';
import bcrypt from 'bcryptjs';

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await execute('SELECT * FROM users WHERE email = ?', [email]);
      const rows = Array.isArray(result) ? result : result.rows || result[0] || [];
      const user = rows[0] || null;
      
      // Debug log
      console.log('User found:', user ? { 
        id: user.id, 
        email: user.email,
        hasPassword: !!user.password 
      } : 'No user found');
      
      return user;
    } catch (error) {
      console.error('Database error in findByEmail:', error);
      throw error;
    }
  }

  // Check if user exists
  static async userExists(id) {
    try {
      const result = await execute('SELECT COUNT(*) as count FROM users WHERE id = ?', [id]);
      const rows = Array.isArray(result) ? result : result.rows || result[0] || [];
      return rows[0]?.count > 0;
    } catch (error) {
      console.error('Database error in userExists:', error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await execute(
        'SELECT id, name, email, avatar, bio, student_id, university, course, program, graduation_year, mobile, created_at FROM users WHERE id = ?', 
        [id]
      );
      
      const user = Array.isArray(result) ? result[0] : result.rows?.[0];
      return user;
    } catch (error) {
      console.error('Database error in findById:', error);
      throw new Error(error.message);
    }
  }
  
  // Get user by ID with all fields
  static async getById(id) {
    try {
      const result = await execute(
        'SELECT * FROM users WHERE id = ?', 
        [id]
      );
      
      const rows = Array.isArray(result) ? result : result.rows || [];
      return rows[0];
    } catch (error) {
      console.error('Database error in getById:', error);
      throw new Error(error.message);
    }
  }

  // Create user
  static async create(userData) {
    const { name, email, password, studentId, university, course, mobile } = userData;
    
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const result = await execute(
        'INSERT INTO users (name, email, password, student_id, university, course, mobile) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, studentId, university, course, mobile]
      );
      
      // Handle different database client responses
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('User creation error:', {
        error: error.message,
        query: 'INSERT INTO users...',
        parameters: [name, email, '***', studentId, university, course, mobile]
      });
      throw new Error('Failed to create user');
    }
  }

  // Update user profile
  static async updateProfile(id, userData) {
    const { name, bio, avatar, program, graduationYear } = userData;
    
    try {
      const result = await execute(
        'UPDATE users SET name = ?, bio = ?, avatar = ?, program = ?, graduation_year = ? WHERE id = ?',
        [name, bio, avatar, program, graduationYear, id]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in updateProfile:', error);
      throw new Error(error.message);
    }
  }

  // Get user skills
  static async getUserSkills(userId) {
    try {
      const result = await execute(
        'SELECT * FROM skills WHERE user_id = ?',
        [userId]
      );
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserSkills:', error);
      throw new Error(error.message);
    }
  }

  // Get user portfolio
  static async getUserPortfolio(userId) {
    try {
      const result = await execute(
        'SELECT * FROM portfolio_items WHERE user_id = ?',
        [userId]
      );
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserPortfolio:', error);
      throw new Error(error.message);
    }
  }
  
  // Get user websites/links
  static async getUserWebsites(userId) {
    try {
      const result = await execute(
        'SELECT * FROM user_websites WHERE user_id = ?',
        [userId]
      );
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserWebsites:', error);
      throw new Error(error.message);
    }
  }

  // Get jobs posted by the user
  static async getUserPostedJobs(userId) {
    try {
      const result = await execute(`
        SELECT j.*, 
          (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count
        FROM jobs j 
        WHERE j.user_id = ?
        ORDER BY j.created_at DESC
      `, [userId]);
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserPostedJobs:', error);
      throw new Error(error.message);
    }
  }

  // Get skills posted by the user
  static async getUserPostedSkills(userId) {
    try {
      const result = await execute(`
        SELECT * FROM skill_marketplace
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [userId]);
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserPostedSkills:', error);
      throw new Error(error.message);
    }
  }

  // Get materials posted by the user
  static async getUserPostedMaterials(userId) {
    try {
      const result = await execute(`
        SELECT * FROM material_marketplace
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [userId]);
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserPostedMaterials:', error);
      throw new Error(error.message);
    }
  }

  // Get user ratings
  static async getUserRatings(userId) {
    try {
      const result = await execute(`
        SELECT r.*, u.name as rater_name, u.avatar as rater_avatar
        FROM ratings r
        JOIN users u ON r.rater_id = u.id
        WHERE r.rated_user_id = ?
        ORDER BY r.created_at DESC
      `, [userId]);
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserRatings:', error);
      throw new Error(error.message);
    }
  }

  // Get user completed jobs
  static async getUserCompletedJobs(userId) {
    try {
      const result = await execute(`
        SELECT 
          wa.*,
          j.title as job_title,
          j.description as job_description,
          j.type as job_type,
          j.payment as job_payment,
          u.name as client_name,
          u.avatar as client_avatar
        FROM work_assignments wa
        LEFT JOIN jobs j ON wa.job_id = j.id
        JOIN users u ON wa.client_id = u.id
        WHERE wa.provider_id = ? AND wa.status = 'Completed'
        ORDER BY wa.completed_date DESC
      `, [userId]);
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserCompletedJobs:', error);
      throw new Error(error.message);
    }
  }

  // Get user verifications
  static async getUserVerifications(userId) {
    try {
      const result = await execute(`
        SELECT * FROM user_verifications
        WHERE user_id = ?
      `, [userId]);
      
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getUserVerifications:', error);
      throw new Error(error.message);
    }
  }
}

export default UserModel;
