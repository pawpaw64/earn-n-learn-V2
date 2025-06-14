
import { Router } from 'express';
const router = Router();
import { 
  getAllMaterials, 
  getMaterialById, 
  createMaterial, 
  updateMaterial, 
  deleteMaterial, 
  getUserMaterials,
  uploadMaterialImage,
  uploadMaterialImageMiddleware
} from '../controllers/materialController.js';
import auth from '../middleware/authMiddleware.js';

// Public routes
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);

// Protected routes
router.post('/', auth, uploadMaterialImageMiddleware, createMaterial);
router.put('/:id', auth, uploadMaterialImageMiddleware, updateMaterial);
router.delete('/:id', auth, deleteMaterial);
router.get('/user/materials', auth, getUserMaterials);

// Image upload route
router.post('/upload-image', auth, uploadMaterialImageMiddleware, uploadMaterialImage);

export default router;
