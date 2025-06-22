
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

// Apply auth middleware to all message routes
router.use(authMiddleware);

// Direct messaging routes
router.get('/direct/:contactId', messageController.getDirectMessages);
router.get('/chats', messageController.getRecentChats);
router.post('/send', messageController.sendMessage);

// Group messaging routes
router.post('/groups', messageController.createGroup);
router.get('/groups', messageController.getUserGroups);
router.get('/groups/find/:namePattern', messageController.findGroupByName);
router.get('/groups/:groupId/messages', messageController.getGroupMessages);
router.post('/groups/message', messageController.sendGroupMessage);
router.post('/groups/members', messageController.addToGroup);
router.delete('/groups/:groupId/members/:userId', messageController.removeFromGroup);
router.get('/groups/:groupId/members', messageController.getGroupMembers);

// User search for messaging
router.get('/users/search/:query', messageController.searchUsers);

export default router;
