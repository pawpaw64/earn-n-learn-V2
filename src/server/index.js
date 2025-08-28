
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import { testConnection } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import workRoutes from './routes/workRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import campusRoutes from './routes/campusRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('[socket] User connected:', socket.id);
  
  // Join a room (for direct messages or group chats)
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });
  
  // Leave a room
  socket.on('leave', (room) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });
  
  // Listen for new messages
  socket.on('send_message', (data) => {
    // For direct messages, room is "dm_smaller-id_larger-id"
    if (data.receiverId) {
      const room = `dm_${Math.min(data.senderId, data.receiverId)}_${Math.max(data.senderId, data.receiverId)}`;
      io.to(room).emit('receive_message', data);
    }
    // For group messages, room is "group_groupId"
    else if (data.groupId) {
      const room = `group_${data.groupId}`;
      io.to(room).emit('receive_message', data);
    }
  });
  
  // Listen for typing indicator
  socket.on('typing', (data) => {
    if (data.receiverId) {
      const room = `dm_${Math.min(data.senderId, data.receiverId)}_${Math.max(data.senderId, data.receiverId)}`;
      socket.to(room).emit('user_typing', data);
    } else if (data.groupId) {
      const room = `group_${data.groupId}`;
      socket.to(room).emit('user_typing', data);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static('uploads'));

// Serve built React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
  
  // Handle React routing, return index.html for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
    }
  });
}

// Ensure upload directories exist
import fs from 'fs';
import path from 'path';

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create upload directories
ensureDirectoryExists('uploads/messages');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/works', workRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/campus', campusRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Earn-n-Learn API is running');
});

// Start the server
const PORT = process.env.PORT || 8080;

// Initialize database and server
async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✅ Database connected successfully');
    } else {
      console.error('❌ Database connection failed');
    }
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Database URL: ${process.env.DB_URL}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
