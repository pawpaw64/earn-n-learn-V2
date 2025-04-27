
import { createPool } from 'mysql2/promise';
import { config } from 'dotenv';
config();

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'no more hoimonty',
  database: process.env.DB_NAME || 'dbEarn_learn',
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
    console.log('Executing query:', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''), // Truncate long queries
      params: params.map(p => 
        typeof p === 'string' ? p.substring(0, 50) + (p.length > 50 ? '...' : '') : p
      )
    });
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Database error:', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      params: params.map(p => 
        typeof p === 'string' ? p.substring(0, 50) + (p.length > 50 ? '...' : '') : p
      ),
      error: error.message
    });
    throw error;
  }
}
export default pool;
