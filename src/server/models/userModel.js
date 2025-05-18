
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
}

export default UserModel;
