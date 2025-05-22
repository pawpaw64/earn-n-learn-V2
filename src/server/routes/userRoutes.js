
import { Router } from 'express';
import { 
  register, 
  login, 
  getMe, 
  getUserById,
  updateProfile,
  getUserWorkHistory,
  getUserDetails
} from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);
router.get('/user/:id', auth, getUserById);
router.put('/profile', auth, updateProfile);
router.get('/user/:id/work-history', auth, getUserWorkHistory);
router.get('/user/:id/details', auth, getUserDetails);

export default router;
