
import { execute } from '../config/db.js';

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toISOString().split('T')[0];
}

class MaterialModel {
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
      const result= await execute(`
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
        WHERE m.user_id != ?
        ORDER BY m.created_at DESC
      `, [userId]);
  
       const rows = await this.#handleQueryResult(result);
      return rows.map(row => ({
        ...row,
        deadline: formatDate(row.deadline),
      }));
    } catch (error) {
      console.error('Database error in getAllExcludingUser:', error);
      throw new Error('Failed to fetch materials');
    }
  }
  
  // Get all materials (single, unified version)
  static async getAll() {
    try {
      // mysql2/promise returns [rows, fields] format
      const result = await execute(`
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
    const rows = await this.#handleQueryResult(result);

      return rows.map(row => ({
        ...row,
        deadline: formatDate(row.deadline),
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
      const result= await execute(`
        SELECT m.*, u.name as user_name, u.avatar as user_avatar, u.email as user_email
        FROM material_marketplace m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `, [id]);
      const rows = await this.#handleQueryResult(result);
      return rows[0];
    } catch (error) {
      console.error('Error in getById:', error);
      throw new Error(error.message);
    }
  }

  // Create material (enhanced to include image_url)
  static async create(materialData) {
    const { user_id, title, description, conditions, price, availability, image_url } = materialData;
    
    try {
      if (!user_id || !title) {
        throw new Error('user_id and title are required fields');
      }

      const result = await execute(
        'INSERT INTO material_marketplace (user_id, title, description, `conditions`, price, availability, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, title, description || null, conditions || null, price || null, availability || null, image_url || null]
      );

      const insertId = result.insertId || result[0]?.insertId;
      if (!insertId) {
        throw new Error('Failed to create material - no insert ID returned');
      }

      return insertId;
    } catch (error) {
      console.error('Material creation failed:', {
        error: error.message,
        stack: error.stack,
        params: materialData
      });
      throw new Error(`Material creation failed: ${error.message}`);
    }
  }

  // Update material (enhanced to include image_url)
  static async update(id, materialData) {
    const { title, description, conditions, price, availability, image_url } = materialData;
    
    try {
      let query = 'UPDATE material_marketplace SET title = ?, description = ?, `conditions` = ?, price = ?, availability = ?';
      let params = [title, description, conditions, price, availability];
      
      // Only update image_url if it's provided
      if (image_url !== undefined) {
        query += ', image_url = ?';
        params.push(image_url);
      }
      
      query += ' WHERE id = ?';
      params.push(id);
      
      const result = await execute(query, params);
      const affectedRows = result.affectedRows || result[0]?.affectedRows;
      return affectedRows > 0;
    } catch (error) {
      console.error('Update material failed:', error);
      throw new Error(error.message);
    }
  }

  // Delete material
  static async remove(id) {
    try {
      const result = await execute(
        'DELETE FROM material_marketplace WHERE id = ?',
        [id]
      );
      const affectedRows = result.affectedRows || result[0]?.affectedRows;
      return affectedRows > 0;
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
