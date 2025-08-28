import express from 'express';
import SettingsController from '../controllers/settingsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Settings routes
router.get('/settings', SettingsController.getUserSettings);
router.put('/settings', SettingsController.updateUserSettings);

export default router;