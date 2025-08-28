import express from 'express';
import PointsController from '../controllers/pointsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Points routes
router.get('/points', PointsController.getUserPoints);
router.get('/points/history', PointsController.getPointsHistory);
router.get('/leaderboard', PointsController.getLeaderboard);
router.get('/achievements', PointsController.getUserAchievements);

export default router;