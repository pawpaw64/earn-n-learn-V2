
import { execute } from '../config/db.js';

class ProjectModel {
  static async createFromApplication(projectData) {
    try {
      console.log('Creating project with data:', projectData);
      
      // 1. Validate required fields
      const requiredFields = ['title', 'provider_id', 'client_id', 'source_type', 'source_id'];
      for (const field of requiredFields) {
        if (projectData[field] === undefined || projectData[field] === null) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // 2. Insert project
      const result = await execute(
        `INSERT INTO projects 
         (title, description, provider_id, client_id, source_type, 
          source_id, project_type, total_amount, hourly_rate, 
          status, start_date, expected_end_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectData.title,
          projectData.description,
          projectData.provider_id,
          projectData.client_id,
          projectData.source_type,
          projectData.source_id,
          projectData.project_type || 'fixed',
          projectData.total_amount,
          projectData.hourly_rate,
          projectData.status || 'active',
          new Date().toISOString().slice(0, 10),
          projectData.expected_end_date
        ]
      );

      const projectId = result.insertId;
      console.log('Created project with ID:', projectId);

      // 3. Create default milestones
      await this.createDefaultMilestones(projectId, projectData.source_type);

      // 4. Get full project details
      const project = await this.getById(projectId);
      
      return project;

    } catch (error) {
      console.error('[ProjectModel] Creation failed:', error);
      throw error;
    }
  }

  static async createFromContact(contactData) {
    try {
      console.log('Creating project from contact with data:', contactData);
      
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
        expected_end_date,
        status = 'active'
      } = contactData;

      const result = await execute(
        `INSERT INTO projects (title, description, provider_id, client_id, 
         source_type, source_id, project_type, total_amount, hourly_rate, 
         status, start_date, expected_end_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, provider_id, client_id, source_type, source_id, 
         project_type, total_amount, hourly_rate, status, 
         new Date().toISOString().slice(0, 10), expected_end_date]
      );

      const projectId = result.insertId;
      console.log('Created project from contact with ID:', projectId);

      await this.createDefaultMilestones(projectId, source_type);
      return this.getById(projectId);
    } catch (error) {
      console.error('[ProjectModel] createFromContact failed:', error);
      throw error;
    }
  }

  static async createDefaultMilestones(projectId, sourceType) {
    try {
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
    } catch (error) {
      console.error('Error creating default milestones:', error);
      throw error;
    }
  }

  // Get project by ID with milestones
  static async getById(id) {
    try {
      const projectResult = await execute(
        `SELECT p.*, 
                provider.name as provider_name, provider.avatar as provider_avatar,
                client.name as client_name, client.avatar as client_avatar
         FROM projects p
         LEFT JOIN users provider ON p.provider_id = provider.id
         LEFT JOIN users client ON p.client_id = client.id
         WHERE p.id = ?`,
        [id]
      );

      if (!projectResult || projectResult.length === 0) return null;

      const project = projectResult[0];

      const milestones = await execute(
        'SELECT * FROM project_milestones WHERE project_id = ? ORDER BY phase_number',
        [id]
      );

      return { ...project, milestones };
    } catch (error) {
      console.error('Error getting project by ID:', error);
      throw error;
    }
  }

  // Get projects for a user (as provider or client)
  static async getByUserId(userId) {
    try {
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

      return projects || [];
    } catch (error) {
      console.error('Error getting projects by user ID:', error);
      return [];
    }
  }

  // Update project status
  static async updateStatus(id, status, userId) {
    try {
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
    } catch (error) {
      console.error('Error updating project status:', error);
      throw error;
    }
  }

  // Update milestone status
  static async updateMilestone(milestoneId, status, notes, userId) {
    try {
      const milestoneResult = await execute(
        'SELECT * FROM project_milestones WHERE id = ?',
        [milestoneId]
      );

      if (!milestoneResult || milestoneResult.length === 0) {
        throw new Error('Milestone not found');
      }

      const milestone = milestoneResult[0];

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
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }

  // Advance to next milestone
  static async advanceToNextMilestone(projectId, currentPhase) {
    try {
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
    } catch (error) {
      console.error('Error advancing to next milestone:', error);
      throw error;
    }
  }

  // Get project updates/activity
  static async getProjectUpdates(projectId) {
    try {
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
    } catch (error) {
      console.error('Error getting project updates:', error);
      return [];
    }
  }

  // Delete project
  static async delete(id) {
    try {
      await execute('DELETE FROM projects WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

export default ProjectModel;
