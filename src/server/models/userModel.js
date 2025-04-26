
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT id, name, email, avatar, student_id, university, course, mobile, created_at FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create user
  static async create(userData) {
    const { name, email, password, studentId, university, course, mobile } = userData;
    
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, student_id, university, course, mobile) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, studentId, university, course, mobile]
      );
      
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update user profile
  static async updateProfile(id, userData) {
    const { name, bio, avatar, program, graduationYear } = userData;
    
    try {
      const [result] = await pool.execute(
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
      const [rows] = await pool.execute(
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
      const [rows] = await pool.execute(
        'SELECT * FROM portfolio_items WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserModel;
