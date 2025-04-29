
import { Router } from 'express';
const router = Router();
import { 
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByUserId
} from '../controllers/jobController.js';
import auth from '../middleware/authMiddleware.js';

// Public routes (accessible without authentication)
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes (require authentication)
router.post('/', auth, createJob);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

// User-specific job routes
router.get('/user/:userId', auth, getJobsByUserId);

export default router;
