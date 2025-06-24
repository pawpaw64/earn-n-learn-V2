import { execute } from '../config/db.js';

// Get all tasks for a project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

     console.log('=== Getting tasks for project ===');
    console.log('Project ID:', projectId);
    console.log('User ID:', userId);

    // Check project access and get user role
    const projectAccess = await execute(
      'SELECT id, provider_id, client_id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [projectId, userId, userId]
    );

    if (!projectAccess || projectAccess.length === 0) {
            console.log('Access denied - user not found in project');

      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const project = projectAccess[0];
    const userRole = project.provider_id === userId ? 'provider' : 'client';
 console.log('Project details:', {
      projectId: project.id,
      providerId: project.provider_id,
      clientId: project.client_id,
      currentUserId: userId,
      determinedRole: userRole
    });
    const tasks = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.project_id = ?
       ORDER BY pt.created_at DESC`,
      [projectId]
    );
    console.log('Tasks found:', tasks.length);

    // Include user role information in response
   const response = {
      tasks: tasks,
      userRole: userRole,
      currentUserId: userId
    };
    
    console.log('Response being sent:', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, due_date, assigned_to } = req.body;
    const userId = req.user.id;

    console.log('Creating task for project:', projectId, 'by user:', userId);

    // First, let's check if the project exists and get its details
    const projectCheck = await execute(
      'SELECT id, provider_id, client_id, title FROM projects WHERE id = ?',
      [projectId]
    );

    console.log('Project check result:', projectCheck);

    if (!projectCheck || projectCheck.length === 0) {
      console.log('Project not found:', projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = projectCheck[0];
    console.log('Project details:', project);
    console.log('User access check - User ID:', userId, 'Provider ID:', project.provider_id, 'Client ID:', project.client_id);

    // Check if user has access to this project
    if (project.provider_id !== userId && project.client_id !== userId) {
      console.log('Access denied - User is neither provider nor client');
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    console.log('Access granted, creating task...');

    // Handle empty assigned_to value - convert empty string to null
    const assignedToValue = assigned_to && assigned_to.trim() !== '' ? assigned_to : null;
    const dueDateValue = due_date && due_date.trim() !== '' ? due_date : null;

    console.log('Task data before insert:', {
      projectId,
      title,
      description,
      priority,
      due_date: dueDateValue,
      assigned_to: assignedToValue,
      created_by: userId
    });
    const result = await execute(
      `INSERT INTO project_tasks (project_id, title, description, priority, 
       due_date, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [projectId, title, description, priority, dueDateValue, assignedToValue, userId]
    );

    const task = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.id = ?`,
      [result.insertId]
    );

    // Log the activity
    await execute(
      `INSERT INTO project_activity (project_id, user_id, activity_type, description, task_id)
       VALUES (?, ?, 'task_update', ?, ?)`,
      [projectId, userId, `Created task: ${title}`, result.insertId]
    );

    console.log('Task created successfully:', task[0]);
    res.status(201).json(task[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, due_date, assigned_to } = req.body;
    const userId = req.user.id;

    // Check if user can update this task
    const taskAccess = await execute(
      `SELECT pt.project_id, p.provider_id, p.client_id 
       FROM project_tasks pt
       JOIN projects p ON pt.project_id = p.id
       WHERE pt.id = ? AND (p.provider_id = ? OR p.client_id = ? OR pt.created_by = ?)`,
      [taskId, userId, userId, userId]
    );

    if (!taskAccess || taskAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to update this task' });
    }
  // Handle empty values properly
    const assignedToValue = assigned_to && assigned_to.trim() !== '' ? assigned_to : null;
    const dueDateValue = due_date && due_date.trim() !== '' ? due_date : null;

    await execute(
      `UPDATE project_tasks SET title = ?, description = ?, priority = ?, 
       due_date = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description, priority, dueDateValue, assignedToValue, taskId]
    );

    const task = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.id = ?`,
      [taskId]
    );

    // Log the activity
    await execute(
      `INSERT INTO project_activity (project_id, user_id, activity_type, description, task_id)
       VALUES (?, ?, 'task_update', ?, ?)`,
      [taskAccess[0].project_id, userId, `Updated task: ${title}`, taskId]
    );

    res.json(task[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    // Check if user can update this task
    const taskAccess = await execute(
      `SELECT pt.project_id, pt.title, p.provider_id, p.client_id 
       FROM project_tasks pt
       JOIN projects p ON pt.project_id = p.id
       WHERE pt.id = ? AND (p.provider_id = ? OR p.client_id = ? OR pt.assigned_to = ?)`,
      [taskId, userId, userId, userId]
    );

    if (!taskAccess || taskAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to update this task' });
    }

    await execute(
      `UPDATE project_tasks SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, notes, taskId]
    );

    const task = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.id = ?`,
      [taskId]
    );

    // Log the activity
    await execute(
      `INSERT INTO project_activity (project_id, user_id, activity_type, description, task_id)
       VALUES (?, ?, 'task_update', ?, ?)`,
      [taskAccess[0].project_id, userId, `Changed task status to ${status}: ${taskAccess[0].title}`, taskId]
    );

    res.json(task[0]);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Check if user can delete this task
    const taskAccess = await execute(
      `SELECT pt.project_id, pt.title, p.provider_id, p.client_id 
       FROM project_tasks pt
       JOIN projects p ON pt.project_id = p.id
       WHERE pt.id = ? AND (p.provider_id = ? OR p.client_id = ? OR pt.created_by = ?)`,
      [taskId, userId, userId, userId]
    );

    if (!taskAccess || taskAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to delete this task' });
    }

    await execute('DELETE FROM project_tasks WHERE id = ?', [taskId]);

    // Log the activity
    await execute(
      `INSERT INTO project_activity (project_id, user_id, activity_type, description)
       VALUES (?, ?, 'task_update', ?)`,
      [taskAccess[0].project_id, userId, `Deleted task: ${taskAccess[0].title}`]
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign task to user
export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignedTo } = req.body;
    const userId = req.user.id;

    // Check if user can assign this task
    const taskAccess = await execute(
      `SELECT pt.project_id, pt.title, p.provider_id, p.client_id 
       FROM project_tasks pt
       JOIN projects p ON pt.project_id = p.id
       WHERE pt.id = ? AND (p.provider_id = ? OR p.client_id = ?)`,
      [taskId, userId, userId]
    );

    if (!taskAccess || taskAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to assign this task' });
    }

    await execute(
      `UPDATE project_tasks SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [assignedTo, taskId]
    );

    const task = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.id = ?`,
      [taskId]
    );

    // Log the activity
    const assigneeName = task[0].assignee_name || 'Unknown';
    await execute(
      `INSERT INTO project_activity (project_id, user_id, activity_type, description, task_id)
       VALUES (?, ?, 'task_update', ?, ?)`,
      [taskAccess[0].project_id, userId, `Assigned task "${taskAccess[0].title}" to ${assigneeName}`, taskId]
    );

    res.json(task[0]);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
