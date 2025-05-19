
import { execute } from '../config/db.js';

class ContactModel {
  // Create new skill contact
  static async createSkillContact(contactData) {
    const { skill_id, user_id, message } = contactData;
    console.log('[model] Creating skill contact:', { skill_id, user_id, message });
    try {
      const [result] = await execute(
        'INSERT INTO skill_contacts (skill_id, user_id, message) VALUES (?, ?, ?)',
        [skill_id, user_id, message]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('ContactModel.createSkillContact() - Error:', error);
      throw error;
    }
  }

  // Create new material contact
  static async createMaterialContact(contactData) {
    const { material_id, user_id, message } = contactData;
    console.log('[model] Creating material contact:', { material_id, user_id, message });
    try {
      const [result] = await execute(
        'INSERT INTO material_contacts (material_id, user_id, message) VALUES (?, ?, ?)',
        [material_id, user_id, message]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('ContactModel.createMaterialContact() - Error:', error);
      throw error;
    }
  }

  // Get skill contacts by user ID (contacts made by this user)
  static async getSkillContactsByUserId(userId) {
    try {
      console.log('[model] Getting skill contacts for user ID:', userId);
      const [rows] = await execute(`
        SELECT sc.*, sm.skill_name, sm.pricing, sm.availability,
        u.name as provider_name, u.email as provider_email, u.avatar as provider_avatar
        FROM skill_contacts sc
        JOIN skill_marketplace sm ON sc.skill_id = sm.id
        JOIN users u ON sm.user_id = u.id
        WHERE sc.user_id = ?
        ORDER BY sc.created_at DESC
      `, [userId]);
      
      console.log(`[model] Retrieved ${rows.length} skill contacts`);
      return rows;
    } catch (error) {
      console.error('ContactModel.getSkillContactsByUserId() - Error:', error);
      throw error;
    }
  }

  // Get material contacts by user ID (contacts made by this user)
  static async getMaterialContactsByUserId(userId) {
    try {
      console.log('[model] Getting material contacts for user ID:', userId);
      const [rows] = await execute(`
        SELECT mc.*, mm.title, mm.price, mm.conditions,
        u.name as seller_name, u.email as seller_email, u.avatar as seller_avatar
        FROM material_contacts mc
        JOIN material_marketplace mm ON mc.material_id = mm.id
        JOIN users u ON mm.user_id = u.id
        WHERE mc.user_id = ?
        ORDER BY mc.created_at DESC
      `, [userId]);
      
      console.log(`[model] Retrieved ${rows.length} material contacts`);
      return rows;
    } catch (error) {
      console.error('ContactModel.getMaterialContactsByUserId() - Error:', error);
      throw error;
    }
  }

  // Get contacts to user's skills (provider)
  static async getToUserSkills(userId) {
    try {
      console.log('[model] Getting contacts to user skills for user ID:', userId);
      const [rows] = await execute(`
        SELECT sc.*, sm.skill_name, sm.pricing, sm.description as skill_description,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar
        FROM skill_contacts sc
        JOIN skill_marketplace sm ON sc.skill_id = sm.id
        JOIN users u ON sc.user_id = u.id
        WHERE sm.user_id = ?
        ORDER BY sc.created_at DESC
      `, [userId]);
      
      console.log(`[model] Retrieved ${rows.length} contacts to user skills`);
      return rows;
    } catch (error) {
      console.error('ContactModel.getToUserSkills() - Error:', error);
      throw error;
    }
  }

  // Get contacts to user's materials (seller)
  static async getToUserMaterials(userId) {
    try {
      console.log('[model] Getting contacts to user materials for user ID:', userId);
      const [rows] = await execute(`
        SELECT mc.*, mm.title, mm.price, mm.conditions, mm.description as material_description,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar
        FROM material_contacts mc
        JOIN material_marketplace mm ON mc.material_id = mm.id
        JOIN users u ON mc.user_id = u.id
        WHERE mm.user_id = ?
        ORDER BY mc.created_at DESC
      `, [userId]);
      
      console.log(`[model] Retrieved ${rows.length} contacts to user materials`);
      return rows;
    } catch (error) {
      console.error('ContactModel.getToUserMaterials() - Error:', error);
      throw error;
    }
  }

  // Update skill contact status
  static async updateSkillContactStatus(id, status) {
    try {
      console.log(`[model] Updating skill contact ${id} status to ${status}`);
      const [result] = await execute(
        'UPDATE skill_contacts SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('ContactModel.updateSkillContactStatus() - Error:', error);
      throw error;
    }
  }

  // Update material contact status
  static async updateMaterialContactStatus(id, status) {
    try {
      console.log(`[model] Updating material contact ${id} status to ${status}`);
      const [result] = await execute(
        'UPDATE material_contacts SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('ContactModel.updateMaterialContactStatus() - Error:', error);
      throw error;
    }
  }

  // Get skill contact by ID
  static async getSkillContactById(id) {
    try {
      console.log(`[model] Getting skill contact with ID: ${id}`);
      const [rows] = await execute(`
        SELECT sc.*, sm.skill_name, sm.pricing, sm.description as skill_description, sm.user_id as provider_id,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar,
        p.name as provider_name, p.email as provider_email, p.avatar as provider_avatar
        FROM skill_contacts sc
        JOIN skill_marketplace sm ON sc.skill_id = sm.id
        JOIN users u ON sc.user_id = u.id
        JOIN users p ON sm.user_id = p.id
        WHERE sc.id = ?
      `, [id]);
      
      return rows[0];
    } catch (error) {
      console.error('ContactModel.getSkillContactById() - Error:', error);
      throw error;
    }
  }

  // Get material contact by ID
  static async getMaterialContactById(id) {
    try {
      console.log(`[model] Getting material contact with ID: ${id}`);
      const [rows] = await execute(`
        SELECT mc.*, mm.title, mm.price, mm.conditions, mm.description as material_description, mm.user_id as seller_id,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar,
        s.name as seller_name, s.email as seller_email, s.avatar as seller_avatar
        FROM material_contacts mc
        JOIN material_marketplace mm ON mc.material_id = mm.id
        JOIN users u ON mc.user_id = u.id
        JOIN users s ON mm.user_id = s.id
        WHERE mc.id = ?
      `, [id]);
      
      return rows[0];
    } catch (error) {
      console.error('ContactModel.getMaterialContactById() - Error:', error);
      throw error;
    }
  }
}

export default ContactModel;
