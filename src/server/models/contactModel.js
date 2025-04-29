
import { execute } from '../config/db.js';

class ContactModel {
  // Create new skill contact
  static async createSkillContact(contactData) {
    const { skill_id, user_id, message } = contactData;
    
    const [result] = await execute(
      'INSERT INTO skill_contacts (skill_id, user_id, message) VALUES (?, ?, ?)',
      [skill_id, user_id, message]
    );
    
    return result.insertId;
  }

  // Create new material contact
  static async createMaterialContact(contactData) {
    const { material_id, user_id, message } = contactData;
    
    const [result] = await execute(
      'INSERT INTO material_contacts (material_id, user_id, message) VALUES (?, ?, ?)',
      [material_id, user_id, message]
    );
    
    return result.insertId;
  }

  // Get skill contacts by user ID (contacts made by this user)
  static async getSkillContactsByUserId(userId) {
    const [rows] = await execute(`
      SELECT sc.*, sm.skill_name, sm.pricing, sm.availability,
      u.name as provider_name, u.email as provider_email
      FROM skill_contacts sc
      JOIN skill_marketplace sm ON sc.skill_id = sm.id
      JOIN users u ON sm.user_id = u.id
      WHERE sc.user_id = ?
      ORDER BY sc.created_at DESC
    `, [userId]);
    return rows;
  }

  // Get material contacts by user ID (contacts made by this user)
  static async getMaterialContactsByUserId(userId) {
    const [rows] = await execute(`
      SELECT mc.*, mm.title, mm.price, mm.conditions,
      u.name as seller_name, u.email as seller_email
      FROM material_contacts mc
      JOIN material_marketplace mm ON mc.material_id = mm.id
      JOIN users u ON mm.user_id = u.id
      WHERE mc.user_id = ?
      ORDER BY mc.created_at DESC
    `, [userId]);
    return rows;
  }

  // Get contacts to user's skills (provider)
  static async getToUserSkills(userId) {
    const [rows] = await execute(`
      SELECT sc.*, sm.skill_name, sm.pricing,
      u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar
      FROM skill_contacts sc
      JOIN skill_marketplace sm ON sc.skill_id = sm.id
      JOIN users u ON sc.user_id = u.id
      WHERE sm.user_id = ?
      ORDER BY sc.created_at DESC
    `, [userId]);
    return rows;
  }

  // Get contacts to user's materials (seller)
  static async getToUserMaterials(userId) {
    const [rows] = await execute(`
      SELECT mc.*, mm.title, mm.price, mm.conditions,
      u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar
      FROM material_contacts mc
      JOIN material_marketplace mm ON mc.material_id = mm.id
      JOIN users u ON mc.user_id = u.id
      WHERE mm.user_id = ?
      ORDER BY mc.created_at DESC
    `, [userId]);
    return rows;
  }

  // Update skill contact status
  static async updateSkillContactStatus(id, status) {
    const [result] = await execute(
      'UPDATE skill_contacts SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }

  // Update material contact status
  static async updateMaterialContactStatus(id, status) {
    const [result] = await execute(
      'UPDATE material_contacts SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }
}

export default ContactModel;
