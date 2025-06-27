
import { Router } from 'express';
const router = Router();
import {
  getProjectResources,
  uploadResource,
  uploadFile,
  deleteResource,
  downloadResource,
  upload
} from '../controllers/projectResourceController.js';
import auth from '../middleware/authMiddleware.js';

// All resource routes require authentication
router.use(auth);

// Resource management routes
router.get('/:projectId/resources', getProjectResources);
router.post('/:projectId/resources', uploadResource); // For URL/link resources
router.post('/:projectId/resources/upload', upload.single('file'), uploadFile); // For file uploads
router.delete('/resources/:resourceId', deleteResource);
router.get('/resources/:resourceId/download', downloadResource);

export default router;