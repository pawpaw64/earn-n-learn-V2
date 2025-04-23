
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function setupDatabase() {
  // First, create a connection without specifying a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'campus_marketplace'}`);
    console.log(`Database ${process.env.DB_NAME || 'campus_marketplace'} created or already exists.`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'campus_marketplace'}`);

    // Create jobs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        payment VARCHAR(100) NOT NULL,
        poster VARCHAR(100) NOT NULL,
        posterEmail VARCHAR(255) NOT NULL,
        posterAvatar VARCHAR(255),
        location VARCHAR(255),
        deadline DATE,
        requirements TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Jobs table created or already exists.');

    // Create skills table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        skill VARCHAR(255) NOT NULL,
        pricing VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        avatarUrl VARCHAR(255),
        experienceLevel VARCHAR(50),
        availability VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Skills table created or already exists.');

    // Create materials table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        material VARCHAR(255) NOT NULL,
        condition VARCHAR(50) NOT NULL,
        price VARCHAR(100) NOT NULL,
        availability VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        avatarUrl VARCHAR(255),
        imageUrl VARCHAR(255),
        duration VARCHAR(100),
        location VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Materials table created or already exists.');

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();
