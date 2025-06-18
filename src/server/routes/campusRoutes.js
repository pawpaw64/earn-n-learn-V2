
import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  createComment,
  getComments,
  togglePostLike,
  toggleCommentLike,
  searchPosts,
  upload
} from '../controllers/campusController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// All routes need authentication
router.use(auth);

// Posts
router.post('/posts', upload.single('attachment'), createPost);
router.get('/posts', getPosts);
router.get('/posts/search', searchPosts);
router.get('/posts/:id', getPostById);

// Comments
router.post('/comments', createComment);
router.get('/posts/:postId/comments', getComments);

// Likes
router.post('/posts/:postId/like', togglePostLike);
router.post('/comments/:commentId/like', toggleCommentLike);

export default router;
