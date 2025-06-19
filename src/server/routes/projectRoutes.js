
import { Router } from 'express';
const router = Router();
import {
  createProjectFromApplication,
  getUserProjects,
  getProjectById,
  updateProjectStatus,
  updateMilestone,
  getProjectActivity
} from '../controllers/projectController.js';
import auth from '../middleware/authMiddleware.js';

// Import sub-route handlers
import projectTaskRoutes from './projectTaskRoutes.js';
import projectResourceRoutes from './projectResourceRoutes.js';
import projectTimeRoutes from './projectTimeRoutes.js';
import projectCommentRoutes from './projectCommentRoutes.js';

// All project routes require authentication
router.use(auth);

// Main project management routes
router.post('/:applicationId/from-application', createProjectFromApplication);
router.get('/my-projects', getUserProjects);
router.get('/:id', getProjectById);
router.put('/:id/status', updateProjectStatus);
router.put('/milestone/:milestoneId', updateMilestone);
router.get('/:id/activity', getProjectActivity);

// Sub-feature routes
router.use('/', projectTaskRoutes);
router.use('/', projectResourceRoutes);
router.use('/', projectTimeRoutes);
router.use('/', projectCommentRoutes);

export default router;
