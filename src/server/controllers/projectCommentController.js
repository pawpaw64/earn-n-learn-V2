
import { execute } from '../config/db.js';

// Get all comments for a project
export const getProjectComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check project access
    const projectAccess = await execute(
      'SELECT id FROM projects WHERE id = ? AND (provider_id = ? OR client_id = ?)',
      [projectId, userId, userId]
    );

    if (!projectAccess || projectAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    const comments = await execute(
      `SELECT pc.*, u.name as user_name, u.avatar as user_avatar
       FROM project_comments pc
       LEFT JOIN users u ON pc.user_id = u.id
       WHERE pc.project_id = ?
       ORDER BY pc.created_at ASC`,
      [projectId]
    );

    res.json(comments);
  } catch (error) {
    console.error('Error fetching project comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message, type = 'general' } = req.body;
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
      `INSERT INTO project_comments (project_id, user_id, message, type) 
       VALUES (?, ?, ?, ?)`,
      [projectId, userId, message, type]
    );

    const comment = await execute(
      `SELECT pc.*, u.name as user_name, u.avatar as user_avatar
       FROM project_comments pc
       LEFT JOIN users u ON pc.user_id = u.id
       WHERE pc.id = ?`,
      [result.insertId]
    );

    res.status(201).json(comment[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Check if user can update this comment (only creator)
    const commentAccess = await execute(
      'SELECT user_id FROM project_comments WHERE id = ? AND user_id = ?',
      [commentId, userId]
    );

    if (!commentAccess || commentAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to update this comment' });
    }

    await execute(
      'UPDATE project_comments SET message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [message, commentId]
    );

    const updatedComment = await execute(
      `SELECT pc.*, u.name as user_name, u.avatar as user_avatar
       FROM project_comments pc
       LEFT JOIN users u ON pc.user_id = u.id
       WHERE pc.id = ?`,
      [commentId]
    );

    res.json(updatedComment[0]);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Check if user can delete this comment (only creator)
    const commentAccess = await execute(
      'SELECT user_id FROM project_comments WHERE id = ? AND user_id = ?',
      [commentId, userId]
    );

    if (!commentAccess || commentAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to delete this comment' });
    }

    await execute('DELETE FROM project_comments WHERE id = ?', [commentId]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
