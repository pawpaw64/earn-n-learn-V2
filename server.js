import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import initDatabase from './src/server/database/initDb.js';

// Manually define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Initialize database (optional, can be commented out if already initialized)
initDatabase().then(() => {
  console.log('Database initialization completed');
}).catch(err => {
  console.error('Database initialization error:', err);
});

// Start the frontend
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Start the backend
const backend = spawn('node', [join(__dirname, 'src/server/index.js')], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  frontend.kill('SIGINT');
  backend.kill('SIGINT');
  process.exit();
});

console.log('Running frontend and backend servers...');
