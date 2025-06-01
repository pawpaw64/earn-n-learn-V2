
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execute } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Read and execute main schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await execute(statement);
      }
    }
    
    // Read and execute wallet schema
    const walletSchemaPath = path.join(__dirname, 'wallet_schema.sql');
    const walletSchemaSQL = fs.readFileSync(walletSchemaPath, 'utf8');
    
    const walletStatements = walletSchemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of walletStatements) {
      if (statement.trim()) {
        await execute(statement);
      }
    }

    // Read and execute bKash schema
    const bkashSchemaPath = path.join(__dirname, 'bkash_schema.sql');
    const bkashSchemaSQL = fs.readFileSync(bkashSchemaPath, 'utf8');
    
    const bkashStatements = bkashSchemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of bkashStatements) {
      if (statement.trim()) {
        await execute(statement);
      }
    }

    // Read and execute message schema
    const messageSchemaPath = path.join(__dirname, 'message_schema.sql');
    if (fs.existsSync(messageSchemaPath)) {
      const messageSchemaSQL = fs.readFileSync(messageSchemaPath, 'utf8');
      
      const messageStatements = messageSchemaSQL.split(';').filter(stmt => stmt.trim());
      
      for (const statement of messageStatements) {
        if (statement.trim()) {
          await execute(statement);
        }
      }
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export default initDatabase;
