
import { Router } from 'express';
const router = Router();
import { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill, getUserSkills } from '../controllers/skillController.js';
import auth from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getAllSkills);
router.get('/:id', getSkillById);

// Protected routes
router.post('/', auth, createSkill);
router.put('/:id', auth, updateSkill);
router.delete('/:id', auth, deleteSkill);
router.get('/user/skills', auth, getUserSkills);

export default router;
