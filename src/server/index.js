
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
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

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Root route
app.get('/', (req, res) => {
  res.send('Earn-n-Learn API is running');
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL: ${process.env.DB_URL}`);
});
