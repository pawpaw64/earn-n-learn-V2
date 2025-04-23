
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

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        bio TEXT,
        program VARCHAR(100),
        graduationYear VARCHAR(20),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists.');

    // Create user_skills table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        acquiredFrom VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('User skills table created or already exists.');

    // Create portfolio table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Portfolio table created or already exists.');

    // Create user_websites table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_websites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        url VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('User websites table created or already exists.');

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();
