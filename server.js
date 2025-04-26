
const { spawn } = require('child_process');
const path = require('path');
const initDatabase = require('./src/server/database/initDb');

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
const backend = spawn('node', [path.join(__dirname, 'src/server/index.js')], {
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
