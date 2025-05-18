
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
config();

const pool = createPool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

// Helper function for executing queries
export async function execute(query, params = []) {
  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
     console.error('Database error:', error.message); // Simplified error
    throw error;
  }
}
export default pool;
