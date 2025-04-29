import { execute } from '../config/db.js';

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toISOString().split('T')[0];
}

class MaterialModel {
  // Get all materials (single, unified version)
  static async getAll() {
    try {
      // mysql2/promise returns [rows, fields] format
      const [rows] = await execute(`
        SELECT 
          m.id,
          u.name,
          m.title as material,
          m.conditions,
          m.price,
          m.availability,
          m.description,
          u.email,
          u.avatar as avatarUrl,
          m.image_url as imageUrl,
          m.created_at
        FROM material_marketplace m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.created_at DESC
      `);

      // Ensure we always have an array
      const resultRows = Array.isArray(rows) ? rows : [rows].filter(Boolean);

      return resultRows.map(row => ({
        ...row,
        created_at: formatDate(row.created_at)
      }));
    } catch (error) {
      console.error('Database error in MaterialModel.getAll:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      throw new Error('Failed to fetch materials. Please try again later.');
    }
  }

  // Get material by ID
  static async getById(id) {
    try {
      const [rows] = await execute(`
        SELECT m.*, u.name as user_name, u.avatar as user_avatar, u.email as user_email
        FROM material_marketplace m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `, [id]);

      if (!rows || rows.length === 0) {
        throw new Error('Material not found');
      }
      
      return rows[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw new Error(error.message);
    }
  }

  // Create material (simplified version)
  static async create(materialData) {
    const { user_id, title, description, conditions, price, availability } = materialData;
    
    try {
      if (!user_id || !title) {
        throw new Error('user_id and title are required fields');
      }

      const { insertId } = await execute(
        'INSERT INTO material_marketplace (user_id, title, description, `conditions`, price, availability) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, description || null, conditions || null, price || null, availability || null]
      );

      if (!insertId) {
        throw new Error('Failed to create material - no insert ID returned');
      }

      const [created] = await execute(
        'SELECT * FROM material_marketplace WHERE id = ?',
        [insertId]
      );

      return created[0] || null;
    } catch (error) {
      console.error('Material creation failed:', {
        error: error.message,
        stack: error.stack,
        params: materialData
      });
      throw new Error(`Material creation failed: ${error.message}`);
    }
  }

  // Update material
  static async update(id, materialData) {
    const { title, description, conditions, price, availability } = materialData;
    
    try {
      const [result] = await execute(
        'UPDATE material_marketplace SET title = ?, description = ?, `conditions` = ?, price = ?, availability = ? WHERE id = ?',
        [title, description, conditions, price, availability, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Update material failed:', error);
      throw new Error(error.message);
    }
  }

  // Delete material
  static async remove(id) {
    try {
      const [result] = await execute(
        'DELETE FROM material_marketplace WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Delete material failed:', error);
      throw new Error(error.message);
    }
  }

  // Get user materials
  static async getUserMaterials(userId) {
    try {
      const [rows] = await execute(
        'SELECT * FROM material_marketplace WHERE user_id = ?',
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Get user materials failed:', error);
      throw new Error(error.message);
    }
  }
}

export default MaterialModel;