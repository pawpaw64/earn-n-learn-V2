import { execute } from '../config/db.js';

class SkillModel {
  // Get all skills in marketplace
  static async getAllSkills() {
    try {
      const [rows] = await execute(`
        SELECT s.*, u.name as user_name, u.avatar as user_avatar
        FROM skill_marketplace s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get skill by ID
  static async getSkillById(id) {
    try {
      const [rows] = await execute(`
        SELECT s.*, u.name as user_name, u.avatar as user_avatar, u.email as user_email
        FROM skill_marketplace s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create skill listing
  static async createSkill(skillData) {
    const { user_id, skill_name, description, pricing, availability } = skillData;
    
    try {
      const [result] = await execute(
        'INSERT INTO skill_marketplace (user_id, skill_name, description, pricing, availability) VALUES (?, ?, ?, ?, ?)',
        [user_id, skill_name, description, pricing, availability]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
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