
import { Router } from 'express';
import { 
  register, 
  login, 
  getMe, 
  getUserById,
  updateProfile,
  uploadAvatar,
  uploadAvatarMiddleware
} from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);
router.get('/:id', auth, getUserById);
router.put('/profile', auth, uploadAvatarMiddleware, updateProfile);

// Avatar upload route
router.post('/upload-avatar', auth, uploadAvatarMiddleware, uploadAvatar);

export default router;
