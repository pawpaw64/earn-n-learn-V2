
import { Router } from 'express';
const router = Router();
import {
  getApplicationById,
  submitApplication,
  updateApplicationStatus,
  getUserApplications,
  getJobApplications
} from '../controllers/applicationController.js';
import auth from '../middleware/authMiddleware.js';

// All routes need authentication
router.use(auth);

// Get application by ID
router.get('/:id', getApplicationById);

// Submit application
router.post('/', submitApplication);

// Update application status
router.put('/:id/status', updateApplicationStatus);

// Get user's applications
router.get('/user/submitted', getUserApplications);

// Get applications to user's jobs
router.get('/user/received', getJobApplications);

export default router;
