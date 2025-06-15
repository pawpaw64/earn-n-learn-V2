
import { execute } from '../config/db.js';

// Get all time entries for a project
export const getProjectTimeEntries = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check project access
    const projectAccess = await execute(
      'SELECT provider_id, client_id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [projectId, userId, userId]
    );

    if (!projectAccess || projectAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const userRole = projectAccess[0].provider_id === userId ? 'provider' : 'client';

    // Providers can see all entries, clients can only see their own or verified entries
    let query = `
      SELECT pte.*, u.name as user_name, pt.title as task_title
      FROM project_time_entries pte
      LEFT JOIN users u ON pte.user_id = u.id
      LEFT JOIN project_tasks pt ON pte.task_id = pt.id
      WHERE pte.project_id = ?
    `;
    
    if (userRole === 'client') {
      query += ' AND (pte.user_id = ? OR pte.status = "approved")';
    }
    
    query += ' ORDER BY pte.date DESC, pte.created_at DESC';

    const params = userRole === 'client' ? [projectId, userId] : [projectId];
    const timeEntries = await execute(query, params);

    res.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new time entry
export const createTimeEntry = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { taskId, description, hours, date } = req.body;
    const userId = req.user.id;

    // Check project access
    const projectAccess = await execute(
      'SELECT provider_id, client_id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [projectId, userId, userId]
    );

    if (!projectAccess || projectAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const result = await execute(
      `INSERT INTO project_time_entries (project_id, task_id, user_id, description, 
       hours, date, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [projectId, taskId, userId, description, hours, date]
    );

    const timeEntry = await execute(
      `SELECT pte.*, u.name as user_name, pt.title as task_title
       FROM project_time_entries pte
       LEFT JOIN users u ON pte.user_id = u.id
       LEFT JOIN project_tasks pt ON pte.task_id = pt.id
       WHERE pte.id = ?`,
      [result.insertId]
    );

    res.status(201).json(timeEntry[0]);
  } catch (error) {
    console.error('Error creating time entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update time entry
export const updateTimeEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const { description, hours, date, status } = req.body;
    const userId = req.user.id;

    // Check if user can update this entry
    const entryAccess = await execute(
      `SELECT pte.*, p.provider_id, p.client_id 
       FROM project_time_entries pte
       JOIN projects p ON pte.project_id = p.id
       WHERE pte.id = ? AND (pte.user_id = ? OR p.provider_id = ? OR p.client_id = ?)`,
      [entryId, userId, userId, userId]
    );

    if (!entryAccess || entryAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to update this time entry' });
    }

    const entry = entryAccess[0];
    const userRole = entry.provider_id === userId ? 'provider' : 'client';

    // Only entry creator can update description, hours, date
    // Only client can approve/reject entries
    if (status && status !== entry.status) {
      if (userRole !== 'client') {
        return res.status(403).json({ message: 'Only client can approve/reject time entries' });
      }
    } else if (entry.user_id !== userId) {
      return res.status(403).json({ message: 'Only entry creator can update entry details' });
    }

    const updateFields = [];
    const updateValues = [];

    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (hours !== undefined) {
      updateFields.push('hours = ?');
      updateValues.push(hours);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    updateValues.push(entryId);

    await execute(
      `UPDATE project_time_entries SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    );

    const updatedEntry = await execute(
      `SELECT pte.*, u.name as user_name, pt.title as task_title
       FROM project_time_entries pte
       LEFT JOIN users u ON pte.user_id = u.id
       LEFT JOIN project_tasks pt ON pte.task_id = pt.id
       WHERE pte.id = ?`,
      [entryId]
    );

    res.json(updatedEntry[0]);
  } catch (error) {
    console.error('Error updating time entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete time entry
export const deleteTimeEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const userId = req.user.id;

    // Check if user can delete this entry (only creator)
    const entryAccess = await execute(
      'SELECT user_id FROM project_time_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    );

    if (!entryAccess || entryAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to delete this time entry' });
    }

    await execute('DELETE FROM project_time_entries WHERE id = ?', [entryId]);
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
