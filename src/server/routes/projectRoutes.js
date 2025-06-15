
import { Router } from 'express';
const router = Router();
import {
  createProjectFromApplication,
  createProjectFromContact,
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
router.post('/:applicationId/from-application',createProjectFromApplication);
router.get('/my-projects', getUserProjects);
router.get('/:id', getProjectById);
router.put('/:id/status', updateProjectStatus);
router.put('/milestone/:milestoneId', updateMilestone);
router.get('/:id/activity', getProjectActivity);
router.post('/:contactId/from-contact/contactType', createProjectFromContact);
export default router;