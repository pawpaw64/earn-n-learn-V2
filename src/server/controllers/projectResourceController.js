
import { execute } from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/projects';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow most common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

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

// Upload a new resource (URL/link)
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
      [projectId, name, type || 'link', url, description, category || 'general', size || 0, userId]
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

// Upload a file
export const uploadFile = async (req, res) => {
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

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, description, category } = req.body;
    const fileUrl = `/uploads/projects/${file.filename}`;
    
    // Determine file type based on mimetype
    let fileType = 'file';
    if (file.mimetype.startsWith('image/')) fileType = 'image';
    else if (file.mimetype.startsWith('video/')) fileType = 'video';
    else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) fileType = 'document';

    const result = await execute(
      `INSERT INTO project_resources (project_id, name, type, url, description, 
       category, size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [projectId, name || file.originalname, fileType, fileUrl, description, category || 'general', file.size, userId]
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
      [projectId, userId, `Uploaded file: ${name || file.originalname}`, result.insertId]
    );

    res.status(201).json(resource[0]);
  } catch (error) {
    console.error('Error uploading file:', error);
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
      `SELECT pr.project_id, pr.url, p.provider_id, p.client_id 
       FROM project_resources pr
       JOIN projects p ON pr.project_id = p.id
       WHERE pr.id = ? AND (p.provider_id = ? OR p.client_id = ? OR pr.uploaded_by = ?)`,
      [resourceId, userId, userId, userId]
    );

    if (!resourceAccess || resourceAccess.length === 0) {
      return res.status(403).json({ message: 'Access denied to delete this resource' });
    }

    const resource = resourceAccess[0];

    // Delete file from filesystem if it's a local file
    if (resource.url && resource.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), resource.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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

export { upload };
