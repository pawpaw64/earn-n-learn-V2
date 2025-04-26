import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDatabase() {
  let connection;
  try {
    // Create connection with database selection
    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306 // Default MySQL port
    });

    console.log('Connected to MySQL server');

    // Read schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Split schema into separate SQL statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      try {
        await connection.query(statement + ';'); // Using query() instead of execute()
      } catch (error) {
        console.error('Error executing statement:', statement);
        throw error;
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Re-throw to handle in calling code
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase().catch(err => {
    console.error('Initialization failed:', err);
    process.exit(1);
  });
}

export default initDatabase;