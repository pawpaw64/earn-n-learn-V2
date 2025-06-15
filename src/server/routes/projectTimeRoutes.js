
import { Router } from 'express';
const router = Router();
import {
  getProjectTimeEntries,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry
} from '../controllers/projectTimeController.js';
import auth from '../middleware/authMiddleware.js';

// All time tracking routes require authentication
router.use(auth);

// Time tracking routes
router.get('/:projectId/time-entries', getProjectTimeEntries);
router.post('/:projectId/time-entries', createTimeEntry);
router.put('/time-entries/:entryId', updateTimeEntry);
router.delete('/time-entries/:entryId', deleteTimeEntry);

export default router;
