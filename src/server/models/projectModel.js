

import { execute } from '../config/db.js';

class ProjectModel {
  // Create a new project from accepted work
  static async createFromWork(workData) {
    const {
      title,
      description,
      provider_id,
      client_id,
      source_type,
      source_id,
      project_type = 'fixed',
      total_amount,
      hourly_rate,
      expected_end_date
    } = workData;

    const result = await execute(
      `INSERT INTO projects (title, description, provider_id, client_id, source_type, source_id, 
       project_type, total_amount, hourly_rate, expected_end_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, provider_id, client_id, source_type, source_id, 
       project_type, total_amount, hourly_rate, expected_end_date]
    );

    const projectId = result.insertId;

    // Create default milestones based on project type
    await this.createDefaultMilestones(projectId, source_type);

    return this.getById(projectId);
  }

  // Create default milestones for different project types
  static async createDefaultMilestones(projectId, sourceType) {
    const milestoneTemplates = {
      'job': [
        'Requirements & Planning',
        'Development/Work',
        'Review & Revisions',
        'Final Delivery'
      ],
      'skill': [
        'Initial Consultation',
        'Work Execution',
        'Final Delivery'
      ],
      'material': [
        'Agreement & Planning',
        'Material Transfer',
        'Completion'
      ]
    };

    const milestones = milestoneTemplates[sourceType] || milestoneTemplates['job'];

    for (let i = 0; i < milestones.length; i++) {
      await execute(
        'INSERT INTO project_milestones (project_id, phase_number, title, status) VALUES (?, ?, ?, ?)',
        [projectId, i + 1, milestones[i], i === 0 ? 'in_progress' : 'pending']
      );
    }
  }

  // Get project by ID with milestones
  static async getById(id) {
    const [project] = await execute(
      `SELECT p.*, 
              provider.name as provider_name, provider.avatar as provider_avatar,
              client.name as client_name, client.avatar as client_avatar
       FROM projects p
       LEFT JOIN users provider ON p.provider_id = provider.id
       LEFT JOIN users client ON p.client_id = client.id
       WHERE p.id = ?`,
      [id]
    );

    if (!project) return null;

    const milestones = await execute(
      'SELECT * FROM project_milestones WHERE project_id = ? ORDER BY phase_number',
      [id]
    );

    return { ...project, milestones };
  }

  // Get projects for a user (as provider or client)
  static async getByUserId(userId) {
    const projects = await execute(
      `SELECT p.*, 
              provider.name as provider_name, provider.avatar as provider_avatar,
              client.name as client_name, client.avatar as client_avatar,
              COUNT(pm.id) as total_milestones,
              SUM(CASE WHEN pm.status = 'completed' THEN 1 ELSE 0 END) as completed_milestones
       FROM projects p
       LEFT JOIN users provider ON p.provider_id = provider.id
       LEFT JOIN users client ON p.client_id = client.id
       LEFT JOIN project_milestones pm ON p.id = pm.project_id
       WHERE p.provider_id = ? OR p.client_id = ?
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [userId, userId]
    );

    return projects;
  }

  // Update project status
  static async updateStatus(id, status, userId) {
    await execute(
      'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // Log the status change
    await execute(
      `INSERT INTO project_updates (project_id, user_id, update_type, new_status) 
       VALUES (?, ?, 'status_change', ?)`,
      [id, userId, status]
    );

    return this.getById(id);
  }

  // Update milestone status
  static async updateMilestone(milestoneId, status, notes, userId) {
    const [milestone] = await execute(
      'SELECT * FROM project_milestones WHERE id = ?',
      [milestoneId]
    );

    if (!milestone) throw new Error('Milestone not found');

    const updateData = { status, updated_at: new Date() };
    if (status === 'completed') {
      updateData.completion_date = new Date();
    }
    if (notes) {
      updateData.notes = notes;
    }

    await execute(
      `UPDATE project_milestones SET status = ?, notes = ?, 
       completion_date = ${status === 'completed' ? 'CURRENT_DATE' : 'completion_date'},
       updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, notes, milestoneId]
    );

    // Log the milestone update
    await execute(
      `INSERT INTO project_updates (project_id, milestone_id, user_id, update_type, message, new_status) 
       VALUES (?, ?, ?, 'milestone_complete', ?, ?)`,
      [milestone.project_id, milestoneId, userId, notes || 'Milestone updated', status]
    );

    // Check if we should move to next milestone
    if (status === 'completed') {
      await this.advanceToNextMilestone(milestone.project_id, milestone.phase_number);
    }

    return this.getById(milestone.project_id);
  }

  // Advance to next milestone
  static async advanceToNextMilestone(projectId, currentPhase) {
    const nextMilestone = await execute(
      'SELECT * FROM project_milestones WHERE project_id = ? AND phase_number = ? AND status = "pending"',
      [projectId, currentPhase + 1]
    );

    if (nextMilestone.length > 0) {
      await execute(
        'UPDATE project_milestones SET status = "in_progress" WHERE id = ?',
        [nextMilestone[0].id]
      );

      await execute(
        'UPDATE projects SET current_phase = ? WHERE id = ?',
        [currentPhase + 1, projectId]
      );
    }
  }

  // Get project updates/activity
  static async getProjectUpdates(projectId) {
    return await execute(
      `SELECT pu.*, u.name as user_name, u.avatar as user_avatar,
              pm.title as milestone_title
       FROM project_updates pu
       LEFT JOIN users u ON pu.user_id = u.id
       LEFT JOIN project_milestones pm ON pu.milestone_id = pm.id
       WHERE pu.project_id = ?
       ORDER BY pu.created_at DESC
       LIMIT 10`,
      [projectId]
    );
  }

  // Delete project
  static async delete(id) {
    await execute('DELETE FROM projects WHERE id = ?', [id]);
    return true;
  }
}

export default ProjectModel;