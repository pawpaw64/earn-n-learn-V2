
const pool = require('../config/db');

class MaterialModel {
  // Get all materials
  static async getAll() {
    try {
      const [rows] = await pool.execute(`
        SELECT m.*, u.name as user_name, u.avatar as user_avatar
        FROM material_marketplace m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.created_at DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get material by ID
  static async getById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT m.*, u.name as user_name, u.avatar as user_avatar, u.email as user_email
        FROM material_marketplace m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Create material
  static async create(materialData) {
    const { user_id, title, description, condition, price, availability } = materialData;
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO material_marketplace (user_id, title, description, condition, price, availability) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, description, condition, price, availability]
      );
      
      return result.insertId;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update material
  static async update(id, materialData) {
    const { title, description, condition, price, availability } = materialData;
    
    try {
      const [result] = await pool.execute(
        'UPDATE material_marketplace SET title = ?, description = ?, condition = ?, price = ?, availability = ? WHERE id = ?',
        [title, description, condition, price, availability, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete material
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM material_marketplace WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user materials
  static async getUserMaterials(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM material_marketplace WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = MaterialModel;
