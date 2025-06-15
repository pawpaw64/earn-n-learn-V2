
import { Router } from 'express';
const router = Router();
import {
  getProjectComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/projectCommentController.js';
import auth from '../middleware/authMiddleware.js';

// All comment routes require authentication
router.use(auth);

// Comment routes
router.get('/:projectId/comments', getProjectComments);
router.post('/:projectId/comments', createComment);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);

export default router;
