
import { Router } from 'express';
const router = Router();
import {
  createProjectFromWork,
  getUserProjects,
  getProjectById,
  updateProjectStatus,
  updateMilestone,
  getProjectActivity
} from '../controllers/projectController.js';
import auth from '../middleware/authMiddleware.js';

// All project routes require authentication
router.use(auth);

// Project management routes
router.post('/from-work', createProjectFromWork);
router.get('/my-projects', getUserProjects);
router.get('/:id', getProjectById);
router.put('/:id/status', updateProjectStatus);
router.put('/milestone/:milestoneId', updateMilestone);
router.get('/:id/activity', getProjectActivity);

export default router;
