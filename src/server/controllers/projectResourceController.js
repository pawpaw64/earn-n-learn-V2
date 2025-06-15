
import { execute } from '../config/db.js';

// Get all resources for a project
export const getProjectResources = async (req, res) => {
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

    const resources = await execute(
      `SELECT pr.*, u.name as uploaded_by_name
       FROM project_resources pr
       LEFT JOIN users u ON pr.uploaded_by = u.id
       WHERE pr.project_id = ?
       ORDER BY pr.created_at DESC`,
      [projectId]
    );

    res.json(resources);
  } catch (error) {
    console.error('Error fetching project resources:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload a new resource
export const uploadResource = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, type, url, description, category, size } = req.body;
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
      `INSERT INTO project_resources (project_id, name, type, url, description, 
       category, size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [projectId, name, type, url, description, category, size, userId]
    );

    const resource = await execute(
      `SELECT pr.*, u.name as uploaded_by_name
       FROM project_resources pr
       LEFT JOIN users u ON pr.uploaded_by = u.id
       WHERE pr.id = ?`,
      [result.insertId]
    );

    // Log the activity
    await execute(
      `INSERT INTO project_activity (project_id, user_id, activity_type, description, resource_id)
       VALUES (?, ?, 'resource_shared', ?, ?)`,
      [projectId, userId, `Shared resource: ${name}`, result.insertId]
    );

    res.status(201).json(resource[0]);
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;

    // Check if user can delete this resource
    const resourceAccess = await execute(
      `SELECT pr.project_id, p.provider_id, p.client_id 
       FROM project_resources pr
       JOIN projects p ON pr.project_id = p.id
       WHERE pr.id = ? AND (p.provider_id = ? OR p.client_id = ? OR pr.uploaded_by = ?)`,
      [resourceId, userId, userId, userId]
    );

    if (!resourceAccess || resourceAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to delete this resource' });
    }

    await execute('DELETE FROM project_resources WHERE id = ?', [resourceId]);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download a resource
export const downloadResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;

    // Check access to resource
    const resource = await execute(
      `SELECT pr.*, p.provider_id, p.client_id 
       FROM project_resources pr
       JOIN projects p ON pr.project_id = p.id
       WHERE pr.id = ? AND (p.provider_id = ? OR p.client_id = ?)`,
      [resourceId, userId, userId]
    );

    if (!resource || resource.length === 0) {
      return res.status(403).json({ message: 'Access denied to this resource' });
    }

    // Return resource info for download
    res.json({
      id: resource[0].id,
      name: resource[0].name,
      url: resource[0].url,
      type: resource[0].type,
      size: resource[0].size
    });
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
