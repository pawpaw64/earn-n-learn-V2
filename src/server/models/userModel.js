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
      const [rows] = await execute(
        'SELECT id, name, email, avatar, student_id, university, course, mobile, created_at FROM users WHERE id = ?', 
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async getById(id) {
    const [rows] = await execute(
      'SELECT * FROM users WHERE id = ?', 
      [id]
    );
    return rows;
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
      const [result] = await execute(
        'UPDATE users SET name = ?, bio = ?, avatar = ?, program = ?, graduation_year = ? WHERE id = ?',
        [name, bio, avatar, program, graduationYear, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user skills
  static async getUserSkills(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM skills WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user portfolio
  static async getUserPortfolio(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM portfolio_items WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default UserModel;