import express from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/messages/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'message-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Apply auth middleware to all message routes
router.use(authMiddleware);

// File upload route
router.post('/upload', upload.single('file'), messageController.uploadFile);

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
router.post('/groups/:groupId/leave', messageController.leaveGroup);
router.delete('/groups/:groupId/members/:userId', messageController.removeFromGroup);
router.get('/groups/:groupId/members', messageController.getGroupMembers);

// User search for messaging
router.get('/users/search/:query', messageController.searchUsers);

export default router;
