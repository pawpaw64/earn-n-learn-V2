import { execute } from '../config/db.js';

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

class SkillModel {
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
  static async getAllExcludingUser(userId) {
    try {
      const rows = await execute(`
        SELECT 
          s.id,
          u.name,
          s.skill_name as skill,
          s.pricing,
          s.description,
          u.email,
          u.avatar as avatarUrl,
          s.availability,
          s.created_at,
          s.image_url as imageUrl
        FROM skill_marketplace s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id != ?
        ORDER BY s.created_at DESC
      `, [userId]);
  
      if (!Array.isArray(rows)) {
        console.error('Unexpected result format:', { type: typeof rows, value: rows });
        throw new Error('Invalid data format received from database');
      }
      
      return rows.map(row => ({
        ...row,
        created_at: formatDate(row.created_at),
      }));
    } catch (error) {
      console.error('Database error in getAllExcludingUser:', error);
      throw new Error('Failed to fetch skills');
    }
  }
  // Add this method to your SkillModel class
static async getById(id) {
  try {
    console.log('Fetching skill with ID:', id);
    const result= await execute(
      `SELECT s.*, u.name, u.avatar as avatarUrl 
       FROM skill_marketplace s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    const rows = await this.#handleQueryResult(result);
    return rows;
  } catch (error) {
    console.error('Error in SkillModel.getById:', error);
    throw new Error('Failed to fetch skill by ID');
  }
}
  // Get all skills in marketplace
  static async getAllSkills() {
    try {
      const rows = await execute(`
        SELECT 
          s.id,
          u.name,
          s.skill_name as skill,
          s.pricing,
          s.description,
          u.email,
          u.avatar as avatarUrl,
          s.availability,
          s.created_at,
          s.image_url as imageUrl
        FROM skill_marketplace s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
      `);

      if (!Array.isArray(rows)) {
        console.error('Unexpected result format:', { type: typeof rows, value: rows });
        throw new Error('Invalid data format received from database');
      }
      

      return rows.map(row => ({
        ...row,
        created_at: formatDate(row.created_at),
      }));
    } catch (error) {
      console.error('Database error in SkillModel.getAll:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw new Error('Failed to fetch skills. Please try again later.');
    }
  }
  // Get skill by ID
   static async getByUserId(userId) {
    try {
      const [rows] = await execute(
        `SELECT s.*, u.name, u.avatar as avatarUrl 
         FROM skill_marketplace s
         JOIN users u ON s.user_id = u.id
         WHERE s.user_id = ?`,
        [userId]
      );
    
      return rows || [];
    } catch (error) {
      console.error('Error in SkillModel.getByUserId:', error);
      throw new Error('Failed to fetch user skills');
    }
  }

  // Create skill listing
  static async createSkill(skillData) {
    const { user_id, skill_name, description, pricing, availability } = skillData;
    
    try {
      // Validate required fields
      if (!user_id || !skill_name || !description) {
        throw new Error('Missing required fields');
      }
  
      // Execute the query with better error handling
      const result = await execute(
        'INSERT INTO skill_marketplace (user_id, skill_name, description, pricing, availability) VALUES (?, ?, ?, ?, ?)',
        [user_id, skill_name, description, pricing, availability]
      );
  
      // Check if the result is valid
      if (!result || !result.insertId) {
        throw new Error('Failed to create skill - no insert ID returned');
      }
  
      // Return the full created skill object by fetching it
      const [createdSkill] = await execute(
        'SELECT * FROM skill_marketplace WHERE id = ?',
        [result.insertId]
      );
  
      return createdSkill[0] || null;
  
    } catch (error) {
      console.error('Error in createSkill:', error);
      throw new Error(`Could not create skill: ${error.message}`);
    }
  }

  // Update skill
  static async updateSkill(id, skillData) {
    const { skill_name, description, pricing, availability } = skillData;
    
    try {
      const [result] = await execute(
        'UPDATE skill_marketplace SET skill_name = ?, description = ?, pricing = ?, availability = ? WHERE id = ?',
        [skill_name, description, pricing, availability, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete skill
  static async deleteSkill(id) {
    try {
      const [result] = await execute('DELETE FROM skill_marketplace WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user skills in marketplace
  static async getUserSkills(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM skill_marketplace WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default SkillModel;