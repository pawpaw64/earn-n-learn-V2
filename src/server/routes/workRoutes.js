
import { Router } from 'express';
const router = Router();
import {
  createWorkFromApplication,
  createWorkFromSkillContact,
  createWorkFromMaterialContact,
  updateWorkStatus,
  getProviderWorks,
  getClientWorks,
  getWorkById
} from '../controllers/workController.js';
import auth from '../middleware/authMiddleware.js';

// All routes need authentication
router.use(auth);

// Create work assignments
router.post('/from-application', createWorkFromApplication);
router.post('/from-skill-contact', createWorkFromSkillContact);
router.post('/from-material-contact', createWorkFromMaterialContact);

// Update work status
router.put('/:id/status', updateWorkStatus);

// Get user works
router.get('/as-provider', getProviderWorks);
router.get('/as-client', getClientWorks);

// Get work by ID
router.get('/:id', getWorkById);

export default router;
