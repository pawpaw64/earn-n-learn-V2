
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  // Create connection without database selection first
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('Connected to MySQL server');

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into separate SQL statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      await connection.execute(statement + ';');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

// Run if executed directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
