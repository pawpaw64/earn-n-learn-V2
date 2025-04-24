import { pool } from './db.js';

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        
        // Test query
        const [result] = await connection.query('SELECT 1');
        console.log('✅ Query test successful');
        
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        // Debug information
        console.log('Current environment variables:', {
            host: process.env.DB_HOST || 'not set',
            user: process.env.DB_USER || 'not set',
            database: process.env.DB_NAME || 'not set'
        });
    } finally {
        process.exit();
    }
}

testConnection();