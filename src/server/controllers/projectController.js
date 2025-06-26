import ProjectModel from '../models/projectModel.js';
import { execute } from '../config/db.js';

// Create project from existing work assignment
export const createProjectFromApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    // Get the application details
    const applicationResult = await execute(
      `SELECT a.*, j.title as job_title, j.payment as job_payment, 
              j.description as job_description, j.user_id as client_id,
              u.name as provider_name, u.email as provider_email
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.user_id = u.id
       WHERE a.id = ? AND (a.user_id = ? OR j.user_id = ?) AND a.status = 'Accepted'`,
      [applicationId, userId, userId]
    );

    if (!applicationResult || applicationResult.length === 0) {
      return res.status(404).json({ message: 'Accepted application not found or you do not have permission to access it.' });
    }

    const application = applicationResult[0];
    console.log('Creating project from application:', { 
      applicationId, 
      userId, 
      application_user_id: application.user_id,
      job_owner_id: application.client_id 
    });
    
    // FIX: Correct role assignment
    // The person who applied (application.user_id) is the PROVIDER
    // The job owner (application.client_id) is the CLIENT
    const projectData = {
      title: application.job_title,
      description: application.job_description,
      provider_id: application.client_id, // applicant is provider
      client_id: application.user_id, // job owner is client
      source_type: 'job',
      source_id: application.job_id,
      project_type: 'fixed',
      total_amount: application.job_payment,
      status: 'active'
    };

    console.log('Project data being created:', projectData);
    const project = await ProjectModel.createFromApplication(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project from application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProjectFromContact = async (req, res) => {
  try {
    const { contactId, contactType } = req.params;
    const { title, description, projectType, totalAmount, hourlyRate, expectedEndDate } = req.body;

    console.log('Creating project from contact:', { contactId, contactType, userId });


    if (contactType === 'skill') {
      const contactResult = await execute(
        `SELECT sc.*, sm.skill_name, sm.pricing as skill_pricing, 
                sm.description as skill_description, sm.user_id as provider_id,
                u.name as client_name, u.email as client_email
         FROM skill_contacts sc
         JOIN skill_marketplace sm ON sc.skill_id = sm.id
         JOIN users u ON sc.user_id = u.id
         WHERE sc.id = ? AND (sc.user_id = ? OR sm.user_id = ?) AND sc.status = 'Accepted'`,
        [contactId, userId, userId]
      );

      if (!contactResult || contactResult.length === 0) {
        return res.status(404).json({ message: 'Skill contact not found' });
      }

      const contact = contactResult[0];

      projectData = {
        title: contact.skill_name,
        description:contact.skill_description,
        provider_id: contact.provider_id, // skill owner is provider
        client_id: contact.user_id, // contact creator is client
        source_type: 'skill',
        source_id: contact.skill_id,
        project_type: projectType || 'fixed',
        total_amount: contact.skill_pricing,
        hourly_rate: hourlyRate,
        expected_end_date: expectedEndDate,
        status: 'active'
      };
    }
  //   else if (contactType === 'material') {
  //     const contactResult = await execute(
  //       `SELECT mc.*, mm.title as material_title, mm.price as material_price, 
  //               mm.description as material_description, mm.user_id as provider_id,
  //               u.name as client_name, u.email as client_email
  //        FROM material_contacts mc
  //        JOIN material_marketplace mm ON mc.material_id = mm.id
  //        JOIN users u ON mc.user_id = u.id
  //        WHERE mc.id = ? AND (mc.user_id = ? OR mm.user_id = ?) AND mc.status = 'Accepted'`,
  //       [contactId, userId, userId]
  //     );

  //     if (!contactResult || contactResult.length === 0) {
  //       return res.status(404).json({ message: 'Material contact not found' });
  //     }

  //     const contact = contactResult[0];

  //     projectData = {
  //       title: contact.material_title,
  //       description: contact.material_description,
  //       provider_id: contact.provider_id, // material owner is provider
  //       client_id: contact.user_id, // contact creator is client
  //       source_type: 'material',
  //       source_id: contact.material_id,
  //       project_type: projectType || 'fixed',
  //       total_amount:  contact.material_price,
  //       hourly_rate: hourlyRate,
  //       expected_end_date: expectedEndDate,
  //       status: 'active'
  //     };
  //   } else {
  //     return res.status(400).json({ message: 'Invalid contact type' });
  //   }

    const project = await ProjectModel.createFromContact(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project from contact:', error);
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
