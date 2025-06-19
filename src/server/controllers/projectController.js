
import { execute } from '../config/db.js';

export const createProjectFromApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    // Get application details
    const applicationResult = await execute(
      `SELECT ja.*, j.title, j.description, j.budget, j.deadline, j.user_id as job_poster_id,
              u1.name as applicant_name, u1.email as applicant_email,
              u2.name as poster_name, u2.email as poster_email
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       JOIN users u1 ON ja.user_id = u1.id
       JOIN users u2 ON j.user_id = u2.id
       WHERE ja.id = ? AND ja.status = 'Accepted'`,
      [applicationId]
    );

    if (!applicationResult || applicationResult.length === 0) {
      return res.status(404).json({ message: 'Accepted application not found' });
    }

    const application = applicationResult[0];

    // Check if user is either the applicant or the job poster
    if (application.user_id !== userId && application.job_poster_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if project already exists for this application
    const existingProject = await execute(
      'SELECT id FROM projects WHERE source_type = "job" AND source_id = ?',
      [applicationId]
    );

    if (existingProject && existingProject.length > 0) {
      return res.status(400).json({ message: 'Project already exists for this application' });
    }

    // Create the project
    const projectResult = await execute(
      `INSERT INTO projects (title, description, provider_id, client_id, source_type, source_id, 
       project_type, total_amount, expected_end_date) 
       VALUES (?, ?, ?, ?, 'job', ?, 'fixed', ?, ?)`,
      [
        application.title,
        application.description,
        application.user_id, // applicant becomes provider
        application.job_poster_id, // job poster becomes client
        applicationId,
        application.budget,
        application.deadline
      ]
    );

    // Create default milestones
    const milestones = [
      { phase: 1, title: 'Project Initiation', description: 'Initial setup and planning' },
      { phase: 2, title: 'Development Phase', description: 'Main work implementation' },
      { phase: 3, title: 'Review & Completion', description: 'Final review and delivery' }
    ];

    for (const milestone of milestones) {
      await execute(
        `INSERT INTO project_milestones (project_id, phase_number, title, description) 
         VALUES (?, ?, ?, ?)`,
        [projectResult.insertId, milestone.phase, milestone.title, milestone.description]
      );
    }

    // Get the created project with full details
    const createdProject = await getProjectDetailsById(projectResult.insertId);
    
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error creating project from application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjectDetailsById = async (projectId) => {
  const projectResult = await execute(
    `SELECT p.*, 
            provider.name as provider_name, provider.email as provider_email,
            client.name as client_name, client.email as client_email
     FROM projects p
     LEFT JOIN users provider ON p.provider_id = provider.id
     LEFT JOIN users client ON p.client_id = client.id
     WHERE p.id = ?`,
    [projectId]
  );

  if (!projectResult || projectResult.length === 0) {
    return null;
  }

  const project = projectResult[0];

  // Get milestones
  const milestones = await execute(
    'SELECT * FROM project_milestones WHERE project_id = ? ORDER BY phase_number',
    [projectId]
  );

  project.milestones = milestones || [];
  return project;
};

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await execute(
      `SELECT p.*, 
              provider.name as provider_name, provider.email as provider_email,
              client.name as client_name, client.email as client_email
       FROM projects p
       LEFT JOIN users provider ON p.provider_id = provider.id
       LEFT JOIN users client ON p.client_id = client.id
       WHERE p.provider_id = ? OR p.client_id = ?
       ORDER BY p.created_at DESC`,
      [userId, userId]
    );

    // Get milestones for each project
    for (const project of projects) {
      const milestones = await execute(
        'SELECT * FROM project_milestones WHERE project_id = ? ORDER BY phase_number',
        [project.id]
      );
      project.milestones = milestones || [];
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await getProjectDetailsById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check access permissions
    if (project.provider_id !== userId && project.client_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Check if user has access to this project
    const projectAccess = await execute(
      'SELECT provider_id, client_id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [id, userId, userId]
    );

    if (!projectAccess || projectAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    await execute(
      'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // Log the activity
    await execute(
      `INSERT INTO project_updates (project_id, user_id, update_type, message, new_status)
       VALUES (?, ?, 'status_change', ?, ?)`,
      [id, userId, `Project status changed to ${status}`, status]
    );

    const updatedProject = await getProjectDetailsById(id);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    // Check if user has access to this milestone's project
    const milestoneAccess = await execute(
      `SELECT pm.project_id, p.provider_id, p.client_id, pm.title
       FROM project_milestones pm
       JOIN projects p ON pm.project_id = p.id
       WHERE pm.id = ? AND (p.provider_id = ? OR p.client_id = ?)`,
      [milestoneId, userId, userId]
    );

    if (!milestoneAccess || milestoneAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to this milestone' });
    }

    const milestone = milestoneAccess[0];

    // Update milestone
    await execute(
      `UPDATE project_milestones SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP,
       completion_date = CASE WHEN ? = 'completed' THEN CURRENT_DATE ELSE completion_date END
       WHERE id = ?`,
      [status, notes, status, milestoneId]
    );

    // Log the activity
    await execute(
      `INSERT INTO project_updates (project_id, milestone_id, user_id, update_type, message)
       VALUES (?, ?, ?, 'milestone_complete', ?)`,
      [milestone.project_id, milestoneId, userId, `Milestone "${milestone.title}" status changed to ${status}`]
    );

    const updatedProject = await getProjectDetailsById(milestone.project_id);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProjectActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check access permissions
    const projectAccess = await execute(
      'SELECT provider_id, client_id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [id, userId, userId]
    );

    if (!projectAccess || projectAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const activity = await execute(
      `SELECT pu.*, u.name as user_name, pm.title as milestone_title
       FROM project_updates pu
       LEFT JOIN users u ON pu.user_id = u.id
       LEFT JOIN project_milestones pm ON pu.milestone_id = pm.id
       WHERE pu.project_id = ?
       ORDER BY pu.created_at DESC`,
      [id]
    );

    res.json(activity || []);
  } catch (error) {
    console.error('Error fetching project activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
