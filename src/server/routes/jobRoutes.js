
import { Router } from 'express';
const router = Router();
import { getAllJobs, getJobById, createJob, updateJob, deleteJob, getUserJobs } from '../controllers/jobController.js';
import auth from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', auth, createJob);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);
router.get('/user/jobs', auth, getUserJobs);

export default router;
