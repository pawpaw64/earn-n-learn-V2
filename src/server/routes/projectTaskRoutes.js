
import { Router } from 'express';
const router = Router();
import {
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus
} from '../controllers/projectTaskController.js';
import auth from '../middleware/authMiddleware.js';

// All task routes require authentication
router.use(auth);

// Task management routes
router.get('/:projectId/tasks', getProjectTasks);
router.post('/:projectId/tasks', createTask);
router.put('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);
router.put('/tasks/:taskId/assign', assignTask);
router.put('/tasks/:taskId/status', updateTaskStatus);

export default router;
