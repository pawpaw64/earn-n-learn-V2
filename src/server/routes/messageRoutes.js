
import { Router } from 'express';
import { 
  createConversation,
  createOrGetDirectConversation,
  sendMessage,
  getConversations,
  getMessages,
  getConversation,
  searchConversations
} from '../controllers/messageController.js';
import auth from '../middleware/authMiddleware.js';

const router = Router();

// All message routes require authentication
router.use(auth);

// Create new conversations
router.post('/conversations', createConversation);
router.post('/direct', createOrGetDirectConversation);

// Send messages
router.post('/', sendMessage);

// Get conversations and messages
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversation);
router.get('/conversations/:id/messages', getMessages);

// Search
router.get('/search', searchConversations);

export default router;
