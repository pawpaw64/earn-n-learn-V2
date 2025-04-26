
import { Router } from 'express';
const router = Router();
import { getAllMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial, getUserMaterials } from '../controllers/materialController.js';
import auth from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);

// Protected routes
router.post('/', auth, createMaterial);
router.put('/:id', auth, updateMaterial);
router.delete('/:id', auth, deleteMaterial);
router.get('/user/materials', auth, getUserMaterials);

export default router;
