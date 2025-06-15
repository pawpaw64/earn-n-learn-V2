
import { Router } from 'express';
const router = Router();
import {
  getApplicationById,
  submitApplication,
  updateApplicationStatus,
  getUserApplications,
  getJobApplications,
  getApplicationsByJobId
} from '../controllers/applicationController.js';
import auth from '../middleware/authMiddleware.js';

// All routes need authentication
router.use(auth);

// Get application by ID
router.get('/:id', getApplicationById);

// Submit application
router.post('/', submitApplication);

// Update application status - make sure this route is correctly defined
router.put('/:id/status', updateApplicationStatus);

// Get user's applications
router.get('/user/submitted', getUserApplications);

// Get applications to user's jobs
router.get('/user/received', getJobApplications);

// Get applications for a specific job
router.get('/job/:jobId', getApplicationsByJobId);

export default router;
