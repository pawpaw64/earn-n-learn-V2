import { execute } from '../config/db.js';

class ContactModel {
  // Create new skill contact
  static async createSkillContact(contactData) {
    const { skill_id, user_id, message } = contactData;
    try {
      const result = await execute(
        'INSERT INTO skill_contacts (skill_id, user_id, message) VALUES (?, ?, ?)',
        [skill_id, user_id, message]
      );
      
      return result[0]?.insertId ?? null;
    } catch (error) {
      console.error('ContactModel.createSkillContact() - Error:', error);
      throw new Error('Failed to create skill contact');
    }
  }

  // Create new material contact
  static async createMaterialContact(contactData) {
    const { material_id, user_id, message } = contactData;
    try {
      const result = await execute(
        'INSERT INTO material_contacts (material_id, user_id, message) VALUES (?, ?, ?)',
        [material_id, user_id, message]
      );
      
      return result[0]?.insertId ?? null;
    } catch (error) {
      console.error('ContactModel.createMaterialContact() - Error:', error);
      throw new Error('Failed to create material contact');
    }
  }

  // Get skill contacts by user ID
  static async getSkillContactsByUserId(userId) {
    try {
      
      const result = await execute(`
        SELECT sc.*, sm.skill_name, sm.pricing, sm.availability,
        u.name as provider_name, u.email as provider_email, u.avatar as provider_avatar
        FROM skill_contacts sc
        JOIN skill_marketplace sm ON sc.skill_id = sm.id
        JOIN users u ON sm.user_id = u.id
        WHERE sc.user_id = ?
        ORDER BY sc.created_at DESC
      `, [userId]);
      
      const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    
      
      return rows;
    } catch (error) {
      console.error('ContactModel.getSkillContactsByUserId() - Error:', error);
      return [];
    }
  }

  // Get material contacts by user ID
  static async getMaterialContactsByUserId(userId) {
    try {
     
      const result = await execute(`
        SELECT mc.*, mm.title, mm.price, mm.conditions,
        u.name as seller_name, u.email as seller_email, u.avatar as seller_avatar
        FROM material_contacts mc
        JOIN material_marketplace mm ON mc.material_id = mm.id
        JOIN users u ON mm.user_id = u.id
        WHERE mc.user_id = ?
        ORDER BY mc.created_at DESC
      `, [userId]);
      
      const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    
      return rows;
    } catch (error) {
      console.error('ContactModel.getMaterialContactsByUserId() - Error:', error);
      return [];
    }
  }

  // Get contacts to user's skills
  static async getToUserSkills(userId) {
    try {
     
      const result = await execute(`
        SELECT sc.*, sm.skill_name, sm.pricing, sm.description as skill_description,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar
        FROM skill_contacts sc
        JOIN skill_marketplace sm ON sc.skill_id = sm.id
        JOIN users u ON sc.user_id = u.id
        WHERE sm.user_id = ?
        ORDER BY sc.created_at DESC
      `, [userId]);
      
     const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
      return rows;
    } catch (error) {
      console.error('ContactModel.getToUserSkills() - Error:', error);
      return [];
    }
  }

  // Get contacts to user's materials
  static async getToUserMaterials(userId) {
    try {
     
      const result = await execute(`
        SELECT mc.*, mm.title, mm.price, mm.conditions, mm.description as material_description,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar
        FROM material_contacts mc
        JOIN material_marketplace mm ON mc.material_id = mm.id
        JOIN users u ON mc.user_id = u.id
        WHERE mm.user_id = ?
        ORDER BY mc.created_at DESC
      `, [userId]);
      
     const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
      return rows;
    } catch (error) {
      console.error('ContactModel.getToUserMaterials() - Error:', error);
      return [];
    }
  }

  // Update skill contact status
  static async updateSkillContactStatus(id, status) {
    try {
      const result = await execute(
        'UPDATE skill_contacts SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );
      
      return result[0]?.affectedRows > 0 ?? false;
    } catch (error) {
      console.error('ContactModel.updateSkillContactStatus() - Error:', error);
      return false;
    }
  }

  // Update material contact status
  static async updateMaterialContactStatus(id, status) {
    try {
      const result = await execute(
        'UPDATE material_contacts SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );
      
      return result[0]?.affectedRows > 0 ?? false;
    } catch (error) {
      console.error('ContactModel.updateMaterialContactStatus() - Error:', error);
      return false;
    }
  }

  // Get skill contact by ID
  static async getSkillContactById(id) {
    try {
      const result = await execute(`
        SELECT sc.*, sm.skill_name, sm.pricing, sm.description as skill_description, sm.user_id as provider_id,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar,
        p.name as provider_name, p.email as provider_email, p.avatar as provider_avatar
        FROM skill_contacts sc
        JOIN skill_marketplace sm ON sc.skill_id = sm.id
        JOIN users u ON sc.user_id = u.id
        JOIN users p ON sm.user_id = p.id
        WHERE sc.id = ?
      `, [id]);
      
      return result[0]?.[0] ?? null;
    } catch (error) {
      console.error('ContactModel.getSkillContactById() - Error:', error);
      return null;
    }
  }

  // Get material contact by ID
  static async getMaterialContactById(id) {
    try {
      const result = await execute(`
        SELECT mc.*, mm.title, mm.price, mm.conditions, mm.description as material_description, mm.user_id as seller_id,
        u.name as contact_name, u.email as contact_email, u.avatar as contact_avatar,
        s.name as seller_name, s.email as seller_email, s.avatar as seller_avatar
        FROM material_contacts mc
        JOIN material_marketplace mm ON mc.material_id = mm.id
        JOIN users u ON mc.user_id = u.id
        JOIN users s ON mm.user_id = s.id
        WHERE mc.id = ?
      `, [id]);
      
      return result[0]?.[0] ?? null;
    } catch (error) {
      console.error('ContactModel.getMaterialContactById() - Error:', error);
      return null;
    }
  }
  static async checkDuplicateSkillContact(skillId, userId) {
  const [rows] = await execute(
    'SELECT id FROM skill_contacts WHERE skill_id = ? AND user_id = ?',
    [skillId, userId]
  );
  return rows;
}
static async checkDuplicateMaterialContact(materialId, userId) {
  const [rows] = await execute(
    'SELECT id FROM material_contacts WHERE material_id = ? AND user_id = ?',
    [materialId, userId]
  );
  return rows;
}

}


export default ContactModel;