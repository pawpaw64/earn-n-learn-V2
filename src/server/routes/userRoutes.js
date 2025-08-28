import { Router } from 'express';
import {
    register,
    login,
    getMe,
    getUserById,
    updateProfile,
    uploadAvatar,
    uploadAvatarMiddleware,
    addUserSkill,
    removeUserSkill,
    addPortfolioItem,
    removePortfolioItem,
    addUserWebsite,
    removeUserWebsite} from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);
router.get('/user/:id', auth, getUserById);
router.put('/profile', auth, uploadAvatarMiddleware, updateProfile);

// Avatar upload route
router.post('/upload-avatar', auth, uploadAvatarMiddleware, uploadAvatar);

// Skills management routes
router.post('/skills', auth, addUserSkill);
router.delete('/skills/:skillId', auth, removeUserSkill);

// Portfolio management routes
router.post('/portfolio', auth, addPortfolioItem);
router.delete('/portfolio/:itemId', auth, removePortfolioItem);

// Websites management routes
router.post('/websites', auth, addUserWebsite);
router.delete('/websites/:websiteId', auth, removeUserWebsite);
export default router;