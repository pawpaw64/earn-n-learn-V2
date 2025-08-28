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
  // Add user skill with enhanced fields
  static async addUserSkill(userId, skillData) {
    const { name, description, acquiredFrom, proficiencyLevel, experienceYears, certifications } = skillData;
    console.log('Adding skill:', { userId, name, description, acquiredFrom, proficiencyLevel, experienceYears, certifications });
    
    try {
      const result = await execute(
        'INSERT INTO skills (user_id, name, description, acquired_from, proficiency_level, experience_years, certifications) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, name, description || null, acquiredFrom || null, proficiencyLevel || 'Beginner', experienceYears || 0, certifications || null]
      );
      
      // Update usage count for predefined skills
      await execute(
        'UPDATE predefined_skills SET usage_count = usage_count + 1 WHERE name = ?',
        [name]
      ).catch(() => {}); // Ignore if skill is not predefined
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Database error in addUserSkill:', error);
      throw new Error(error.message);
    }
  }

  // Get predefined skills for suggestions
  static async getPredefinedSkills(searchTerm = '', category = '') {
    try {
      let query = 'SELECT name, category, description FROM predefined_skills';
      let params = [];
      
      if (searchTerm || category) {
        query += ' WHERE';
        const conditions = [];
        
        if (searchTerm) {
          conditions.push(' name LIKE ?');
          params.push(`%${searchTerm}%`);
        }
        
        if (category) {
          conditions.push(' category = ?');
          params.push(category);
        }
        
        query += conditions.join(' AND');
      }
      
      query += ' ORDER BY usage_count DESC, name ASC LIMIT 20';
      
      const result = await execute(query, params);
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getPredefinedSkills:', error);
      throw new Error(error.message);
    }
  }

  // Add custom skill to predefined skills
  static async addCustomSkillToPredefined(skillName, category = 'Custom') {
    try {
      await execute(
        'INSERT IGNORE INTO predefined_skills (name, category, usage_count) VALUES (?, ?, 1)',
        [skillName, category]
      );
    } catch (error) {
      console.error('Database error in addCustomSkillToPredefined:', error);
      // Don't throw error as this is not critical
    }
  }

  // Get skill categories
  static async getSkillCategories() {
    try {
      const result = await execute(
        'SELECT DISTINCT category FROM predefined_skills ORDER BY category'
      );
      return Array.isArray(result) ? result : result.rows || [];
    } catch (error) {
      console.error('Database error in getSkillCategories:', error);
      throw new Error(error.message);
    }
  }

  // Remove user skill
  static async removeUserSkill(userId, skillId) {
    try {
      const result = await execute(
        'DELETE FROM skills WHERE id = ? AND user_id = ?',
        [skillId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in removeUserSkill:', error);
      throw new Error(error.message);
    }
  }

  // Add portfolio item
  static async addPortfolioItem(userId, itemData) {
    const { title, description, url, type } = itemData;
    
    try {
      const result = await execute(
        'INSERT INTO portfolio_items (user_id, title, description, url, type) VALUES (?, ?, ?, ?, ?)',
        [userId, title, description || null, url, type || 'other']
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Database error in addPortfolioItem:', error);
      throw new Error(error.message);
    }
  }

  // Remove portfolio item
  static async removePortfolioItem(userId, itemId) {
    try {
      const result = await execute(
        'DELETE FROM portfolio_items WHERE id = ? AND user_id = ?',
        [itemId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in removePortfolioItem:', error);
      throw new Error(error.message);
    }
  }

  // Add user website
  static async addUserWebsite(userId, websiteData) {
    const { title, url, icon } = websiteData;
    
    try {
      const result = await execute(
        'INSERT INTO user_websites (user_id, title, url, description) VALUES (?, ?, ?, ?)',
        [userId, title, url, icon || 'link']
      );
      
      return result.insertId || result[0]?.insertId || result.rows?.[0]?.insertId;
    } catch (error) {
      console.error('Database error in addUserWebsite:', error);
      throw new Error(error.message);
    }
  }

  // Remove user website
  static async removeUserWebsite(userId, websiteId) {
    try {
      const result = await execute(
        'DELETE FROM user_websites WHERE id = ? AND user_id = ?',
        [websiteId, userId]
      );
      
      return Array.isArray(result) ? result[0]?.affectedRows > 0 : result.affectedRows > 0;
    } catch (error) {
      console.error('Database error in removeUserWebsite:', error);
      throw new Error(error.message);
    }
  }
}

export default UserModel;