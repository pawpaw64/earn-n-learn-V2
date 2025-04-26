
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);

// Protected routes
router.post('/', auth, skillController.createSkill);
router.put('/:id', auth, skillController.updateSkill);
router.delete('/:id', auth, skillController.deleteSkill);
router.get('/user/skills', auth, skillController.getUserSkills);

module.exports = router;
