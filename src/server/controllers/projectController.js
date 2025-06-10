import ProjectModel from '../models/projectModel.js';
import { execute } from '../config/db.js';

// Create project from existing work assignment
export const createProjectFromWork = async (req, res) => {
  try {
    const { workId, title, description, projectType, totalAmount, hourlyRate, expectedEndDate } = req.body;
    const userId = req.user.id;

    // Get the work assignment details
    const workResult = await execute(
      `SELECT wa.*, j.title as job_title, j.payment as job_payment, j.description as job_description,
              sm.skill_name, sm.pricing as skill_pricing, sm.description as skill_description,
              mm.title as material_title, mm.price as material_price, mm.description as material_description
       FROM work_assignments wa
       LEFT JOIN jobs j ON wa.job_id = j.id
       LEFT JOIN skill_marketplace sm ON wa.skill_id = sm.id
       LEFT JOIN material_marketplace mm ON wa.material_id = mm.id
       WHERE wa.id = ? AND (wa.provider_id = ? OR wa.client_id = ?)`,
      [workId, userId, userId]
    );

    if (workResult.length === 0) {
      return res.status(404).json({ message: 'Work assignment not found' });
    }

    const work = workResult[0];
    
    // Determine source type and create project data
    let sourceType, sourceId, projectTitle, projectDescription, amount;
    
    if (work.job_id) {
      sourceType = 'job';
      sourceId = work.job_id;
      projectTitle = title || work.job_title;
      projectDescription = description || work.job_description;
      amount = totalAmount || work.job_payment;
    } else if (work.skill_id) {
      sourceType = 'skill';
      sourceId = work.skill_id;
      projectTitle = title || work.skill_name;
      projectDescription = description || work.skill_description;
      amount = totalAmount || work.skill_pricing;
    } else if (work.material_id) {
      sourceType = 'material';
      sourceId = work.material_id;
      projectTitle = title || work.material_title;
      projectDescription = description || work.material_description;
      amount = totalAmount || work.material_price;
    }

    const projectData = {
      title: projectTitle,
      description: projectDescription,
      provider_id: work.provider_id,
      client_id: work.client_id,
      source_type: sourceType,
      source_id: sourceId,
      project_type: projectType || 'fixed',
      total_amount: amount,
      hourly_rate: hourlyRate,
      expected_end_date: expectedEndDate
    };

    const project = await ProjectModel.createFromWork(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's projects
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await ProjectModel.getByUserId(userId);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const project = await ProjectModel.getById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is part of this project
    if (project.provider_id !== userId && project.client_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update project status
export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const project = await ProjectModel.updateStatus(id, status, userId);
    res.json(project);
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update milestone
export const updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    const project = await ProjectModel.updateMilestone(milestoneId, status, notes, userId);
    res.json(project);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get project activity/updates
export const getProjectActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await ProjectModel.getProjectUpdates(id);
    res.json(activity);
  } catch (error) {
    console.error('Error fetching project activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
