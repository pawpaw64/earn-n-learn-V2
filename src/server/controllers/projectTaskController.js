
import { execute } from '../config/db.js';

// Get all tasks for a project
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user has access to this project
    const projectAccess = await execute(
      'SELECT id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [projectId, userId, userId]
    );

    if (!projectAccess || projectAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

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

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const userId = req.user.id;

    // Check project access and get user role
    const project = await execute(
      'SELECT provider_id, client_id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [projectId, userId, userId]
    );

    if (!project || project.length === 0) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const userRole = project[0].provider_id === userId ? 'provider' : 'client';

    const result = await execute(
      `INSERT INTO project_tasks (project_id, title, description, priority, due_date, 
       assigned_to, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [projectId, title, description, priority, dueDate, assignedTo, userId]
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

    res.status(201).json(task[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate } = req.body;
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

    await execute(
      'UPDATE project_tasks SET title = ?, description = ?, priority = ?, due_date = ? WHERE id = ?',
      [title, description, priority, dueDate, taskId]
    );

    const updatedTask = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.id = ?`,
      [taskId]
    );

    res.json(updatedTask[0]);
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

    // Check task access and get user role
    const taskInfo = await execute(
      `SELECT pt.*, p.provider_id, p.client_id 
       FROM project_tasks pt
       JOIN projects p ON pt.project_id = p.id
       WHERE pt.id = ? AND (p.provider_id = ? OR p.client_id = ? OR pt.assigned_to = ?)`,
      [taskId, userId, userId, userId]
    );

    if (!taskInfo || taskInfo.length === 0) {
      return res.status(403).json({ message: 'Access denied to update this task' });
    }

    const task = taskInfo[0];
    const userRole = task.provider_id === userId ? 'provider' : 'client';

    // Business logic for task status updates
    if (status === 'completed' && task.assigned_to !== userId && userRole !== 'provider') {
      return res.status(403).json({ message: 'Only assigned user or provider can mark task as completed' });
    }

    if (status === 'verified' && userRole !== 'client') {
      return res.status(403).json({ message: 'Only client can verify completed tasks' });
    }

    await execute(
      'UPDATE project_tasks SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, notes, taskId]
    );

    // Log the status change
    await execute(
      `INSERT INTO project_activity (project_id, user_id, activity_type, description, task_id)
       VALUES (?, ?, 'task_update', ?, ?)`,
      [task.project_id, userId, `Task marked as ${status}${notes ? ': ' + notes : ''}`, taskId]
    );

    const updatedTask = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.id = ?`,
      [taskId]
    );

    res.json(updatedTask[0]);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Check if user can delete this task (only creator or project participants)
    const taskAccess = await execute(
      `SELECT pt.project_id, p.provider_id, p.client_id 
       FROM project_tasks pt
       JOIN projects p ON pt.project_id = p.id
       WHERE pt.id = ? AND (p.provider_id = ? OR p.client_id = ? OR pt.created_by = ?)`,
      [taskId, userId, userId, userId]
    );

    if (!taskAccess || taskAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to delete this task' });
    }

    await execute('DELETE FROM project_tasks WHERE id = ?', [taskId]);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign task
export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignedTo } = req.body;
    const userId = req.user.id;

    // Check if user can assign this task (project participants only)
    const taskAccess = await execute(
      `SELECT pt.project_id, p.provider_id, p.client_id 
       FROM project_tasks pt
       JOIN projects p ON pt.project_id = p.id
       WHERE pt.id = ? AND (p.provider_id = ? OR p.client_id = ?)`,
      [taskId, userId, userId]
    );

    if (!taskAccess || taskAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to assign this task' });
    }

    await execute(
      'UPDATE project_tasks SET assigned_to = ? WHERE id = ?',
      [assignedTo, taskId]
    );

    const updatedTask = await execute(
      `SELECT pt.*, 
              creator.name as creator_name,
              assignee.name as assignee_name
       FROM project_tasks pt
       LEFT JOIN users creator ON pt.created_by = creator.id
       LEFT JOIN users assignee ON pt.assigned_to = assignee.id
       WHERE pt.id = ?`,
      [taskId]
    );

    res.json(updatedTask[0]);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
