
import { useState, useEffect } from 'react';
import axios from 'axios';

const DatabaseConnectionTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Checking database connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Simple ping to API to check if backend is running
        const response = await axios.get('http://localhost:8080/api/users/ping');
        setStatus('success');
        setMessage('Database connection successful');
      } catch (error) {
        console.error('Database connection failed:', error);
        setStatus('error');
        setMessage('Database connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium text-lg mb-2">Database Connection Status</h3>
      <div className={`flex items-center ${
        status === 'success' ? 'text-green-600' : 
        status === 'error' ? 'text-red-600' : 'text-yellow-600'
      }`}>
        <div className={`w-3 h-3 rounded-full mr-2 ${
          status === 'success' ? 'bg-green-600' : 
          status === 'error' ? 'bg-red-600' : 'bg-yellow-600'
        }`}></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default DatabaseConnectionTest;
