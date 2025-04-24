console.log("Server.js is being executed!");import express from 'express';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import { pool } from './config/db.js';

const app = express();

// Middleware setup

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request body:', { ...req.body, password: '[REDACTED]' });
    }
    next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint is working!' });
  });

// Auth routes
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});
// filepath: d:\Codes\projects\GitHub\skill-share-campus-75\backend\server.js
process.on('uncaughtException', (err) => {
    console.error('Unhandled exception:', err);
  });

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET  /api/test');
    console.log('- POST /api/auth/register');
    console.log('- POST /api/auth/login');
});