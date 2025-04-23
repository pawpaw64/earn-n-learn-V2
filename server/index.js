
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
