import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

export default router;