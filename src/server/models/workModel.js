
import { execute } from '../config/db.js';

class WorkModel {
  // Create new work assignment from job application
  static async createFromJobApplication(applicationId, providerId, clientId) {
    const [application] = await execute('SELECT job_id FROM applications WHERE id = ?', [applicationId]);
    
    if (!application || !application[0]) {
      throw new Error('Application not found');
    }
    
    const jobId = application[0].job_id;
    
    const [result] = await execute(
      'INSERT INTO work_assignments (job_id, provider_id, client_id) VALUES (?, ?, ?)',
      [jobId, providerId, clientId]
    );
    
    return result.insertId;
  }

  // Create new work assignment from skill contact
  static async createFromSkillContact(contactId, providerId, clientId) {
    const [contact] = await execute('SELECT skill_id FROM skill_contacts WHERE id = ?', [contactId]);
    
    if (!contact || !contact[0]) {
      throw new Error('Skill contact not found');
    }
    
    const skillId = contact[0].skill_id;
    
    const [result] = await execute(
      'INSERT INTO work_assignments (skill_id, provider_id, client_id) VALUES (?, ?, ?)',
      [skillId, providerId, clientId]
    );
    
    return result.insertId;
  }

  // Create new work assignment from material contact
  static async createFromMaterialContact(contactId, providerId, clientId) {
    const [contact] = await execute('SELECT material_id FROM material_contacts WHERE id = ?', [contactId]);
    
    if (!contact || !contact[0]) {
      throw new Error('Material contact not found');
    }
    
    const materialId = contact[0].material_id;
    
    const [result] = await execute(
      'INSERT INTO work_assignments (material_id, provider_id, client_id) VALUES (?, ?, ?)',
      [materialId, providerId, clientId]
    );
    
    return result.insertId;
  }

  // Get work assignments where user is provider
 static async getByProviderId(userId) {
  console.debug('WorkModel.getByProviderId() - Start', { userId });
  try {
    const result = await execute(`
      (
        SELECT 
          j.id,
          j.title,
          j.description,
          j.type,
          j.payment,
          'job' as listing_type,
          j.created_at,
          u.name as provider_name,
          u.avatar as provider_avatar
        FROM jobs j
        JOIN users u ON j.user_id = u.id
        WHERE j.user_id = ?
      )
      UNION ALL
      (
        SELECT 
          sm.id,
          sm.skill_name as title,
          sm.description,
          'skill' as type,
          sm.pricing as payment,
          'skill' as listing_type,
          sm.created_at,
          u.name as provider_name,
          u.avatar as provider_avatar
        FROM skill_marketplace sm
        JOIN users u ON sm.user_id = u.id
        WHERE sm.user_id = ?
      )
      UNION ALL
      (
        SELECT 
          mm.id,
          mm.title,
          mm.description,
          'material' as type,
          mm.price as payment,
          'material' as listing_type,
          mm.created_at,
          u.name as provider_name,
          u.avatar as provider_avatar
        FROM material_marketplace mm
        JOIN users u ON mm.user_id = u.id
        WHERE mm.user_id = ?
      )
      ORDER BY created_at DESC
    `, [userId, userId, userId]); // Three userId parameters for the three queries
 const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    console.debug('WorkModel.getByProviderId() - Result', { userId, count: rows.length });
    return rows;
  } catch (error) {
    console.error('WorkModel.getByProviderId() - Error', {
      userId,
      error: error.message,
      stack: error.stack
    });
    throw new Error('Failed to fetch provider listings'); // More descriptive error
  }
}

  // Get work assignments where user is client
  static async getByClientId(userId) {
    const [rows] = await execute(`
      SELECT wa.*, 
        j.title as job_title, j.type as job_type, j.payment as job_payment,
        sm.skill_name, sm.pricing as skill_pricing,
        mm.title as material_title, mm.price as material_price,
        u.name as provider_name, u.email as provider_email, u.avatar as provider_avatar
      FROM work_assignments wa
      LEFT JOIN jobs j ON wa.job_id = j.id
      LEFT JOIN skill_marketplace sm ON wa.skill_id = sm.id
      LEFT JOIN material_marketplace mm ON wa.material_id = mm.id
      JOIN users u ON wa.provider_id = u.id
      WHERE wa.client_id = ?
      ORDER BY wa.created_at DESC
    `, [userId]);
    
    return rows;
  }

  // Update work assignment status
  static async updateStatus(id, status) {
    const [result] = await execute(
      'UPDATE work_assignments SET status = ? WHERE id = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }

  // Complete work assignment
  static async complete(id) {
    const [result] = await execute(
      'UPDATE work_assignments SET status = "Completed", end_date = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  // Get work assignment by ID
  static async getById(id) {
    console.debug('WorkModel.getById() - Start', { id });
    
    if (!id) {
      throw new Error('ID is required');
    }
    
   try{ const result= await execute(`
      SELECT wa.*, 
        j.title as job_title, j.description as job_description, j.type as job_type, j.payment as job_payment,
        sm.skill_name, sm.description as skill_description, sm.pricing as skill_pricing,
        mm.title as material_title, mm.description as material_description, mm.price as material_price,
        p.name as provider_name, p.email as provider_email, p.avatar as provider_avatar,
        c.name as client_name, c.email as client_email, c.avatar as client_avatar
      FROM work_assignments wa
      LEFT JOIN jobs j ON wa.job_id = j.id
      LEFT JOIN skill_marketplace sm ON wa.skill_id = sm.id
      LEFT JOIN material_marketplace mm ON wa.material_id = mm.id
      JOIN users p ON wa.provider_id = p.id
      JOIN users c ON wa.client_id = c.id
      WHERE wa.id = ?
    `, [id]);
    const rows = Array.isArray(result) ? 
      (result[0] && Array.isArray(result[0]) ? result[0] : result) : 
      [];
    console.debug('WorkModel.getById() - Result', rows);
    return rows;
  }
  catch (error) {
    console.error('WorkModel.getById() - Error', {
      id,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
}

export default WorkModel;
