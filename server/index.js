
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_marketplace',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Example API endpoint to get jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Example API endpoint to add a job
app.post('/api/jobs', async (req, res) => {
  const { title, type, description, payment, poster, posterEmail, location, deadline, requirements } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO jobs (title, type, description, payment, poster, posterEmail, location, deadline, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, type, description, payment, poster, posterEmail, location, deadline || null, requirements || null]
    );
    
    res.status(201).json({ 
      message: 'Job created successfully', 
      jobId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// User profile endpoints

// Get user profile
app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user basic info
    const [userRows] = await pool.query('SELECT id, name, email, avatar, bio, program, graduationYear FROM users WHERE id = ?', [userId]);
    
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userRows[0];
    
    // Get user skills
    const [skillRows] = await pool.query('SELECT id, name, description, acquiredFrom FROM user_skills WHERE userId = ?', [userId]);
    
    // Get portfolio items
    const [portfolioRows] = await pool.query('SELECT id, title, description, url, type FROM portfolio WHERE userId = ?', [userId]);
    
    // Get website links
    const [websiteRows] = await pool.query('SELECT id, title, url, icon FROM user_websites WHERE userId = ?', [userId]);
    
    res.json({
      ...user,
      skills: skillRows,
      portfolio: portfolioRows,
      websites: websiteRows
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile basic info
app.put('/api/users/:userId/profile', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, bio, program, graduationYear } = req.body;
    
    await pool.query(
      'UPDATE users SET name = ?, email = ?, bio = ?, program = ?, graduationYear = ? WHERE id = ?',
      [name, email, bio, program, graduationYear, userId]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Upload profile avatar
app.post('/api/users/:userId/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, userId]);
    
    res.json({ 
      message: 'Avatar uploaded successfully',
      imageUrl: avatarUrl
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Add user skill
app.post('/api/users/:userId/skills', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, description, acquiredFrom } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO user_skills (userId, name, description, acquiredFrom) VALUES (?, ?, ?, ?)',
      [userId, name, description, acquiredFrom]
    );
    
    res.status(201).json({
      message: 'Skill added successfully',
      skillId: result.insertId
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

// Delete user skill
app.delete('/api/users/:userId/skills/:skillId', async (req, res) => {
  try {
    const { userId, skillId } = req.params;
    
    await pool.query('DELETE FROM user_skills WHERE id = ? AND userId = ?', [skillId, userId]);
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Add portfolio item
app.post('/api/users/:userId/portfolio', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, description, url, type } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO portfolio (userId, title, description, url, type) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, url, type]
    );
    
    res.status(201).json({
      message: 'Portfolio item added successfully',
      portfolioId: result.insertId
    });
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    res.status(500).json({ error: 'Failed to add portfolio item' });
  }
});

// Delete portfolio item
app.delete('/api/users/:userId/portfolio/:portfolioId', async (req, res) => {
  try {
    const { userId, portfolioId } = req.params;
    
    await pool.query('DELETE FROM portfolio WHERE id = ? AND userId = ?', [portfolioId, userId]);
    
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

// Add website link
app.post('/api/users/:userId/websites', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, url, icon } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO user_websites (userId, title, url, icon) VALUES (?, ?, ?, ?)',
      [userId, title, url, icon]
    );
    
    res.status(201).json({
      message: 'Website link added successfully',
      websiteId: result.insertId
    });
  } catch (error) {
    console.error('Error adding website link:', error);
    res.status(500).json({ error: 'Failed to add website link' });
  }
});

// Delete website link
app.delete('/api/users/:userId/websites/:websiteId', async (req, res) => {
  try {
    const { userId, websiteId } = req.params;
    
    await pool.query('DELETE FROM user_websites WHERE id = ? AND userId = ?', [websiteId, userId]);
    
    res.json({ message: 'Website link deleted successfully' });
  } catch (error) {
    console.error('Error deleting website link:', error);
    res.status(500).json({ error: 'Failed to delete website link' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
