
import { Router } from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  getUserApplications, 
  getUserWorks
} from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

// My applications and works
router.get('/applications', auth, getUserApplications);
router.get('/works', auth, getUserWorks);

export default router;
