
import { Router } from 'express';
const router = Router();
import {
  submitSkillContact,
  submitMaterialContact,
  updateSkillContactStatus,
  updateMaterialContactStatus,
  getUserSkillContacts,
  getUserMaterialContacts,
  getSkillContacts,
  getMaterialContacts
} from '../controllers/contactController.js';
import auth from '../middleware/authMiddleware.js';

// All routes need authentication
router.use(auth);

// Submit contacts
router.post('/skill', submitSkillContact);
router.post('/material', submitMaterialContact);

// Update contact status
router.put('/skill/:id/status', updateSkillContactStatus);
router.put('/material/:id/status', updateMaterialContactStatus);

// Get user initiated contacts
router.get('/user/skill', getUserSkillContacts);
router.get('/user/material', getUserMaterialContacts);

// Get contacts to user posts
router.get('/received/skill', getSkillContacts);
router.get('/received/material', getMaterialContacts);

export default router;
