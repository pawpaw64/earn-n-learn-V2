
const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.get('/', materialController.getAllMaterials);
router.get('/:id', materialController.getMaterialById);

// Protected routes
router.post('/', auth, materialController.createMaterial);
router.put('/:id', auth, materialController.updateMaterial);
router.delete('/:id', auth, materialController.deleteMaterial);
router.get('/user/materials', auth, materialController.getUserMaterials);

module.exports = router;
