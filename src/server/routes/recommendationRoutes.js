import { Router } from 'express';
import RecommendationController from '../controllers/recommendationController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// Get all recommendations
router.get('/all', auth, RecommendationController.getAllRecommendations);

// Get specific type recommendations
router.get('/jobs', auth, RecommendationController.getJobRecommendations);
router.get('/skills', auth, RecommendationController.getSkillRecommendations);
router.get('/materials', auth, RecommendationController.getMaterialRecommendations);

export default router;