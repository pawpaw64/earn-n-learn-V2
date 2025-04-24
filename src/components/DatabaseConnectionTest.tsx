
import React, { useState } from 'react';
import { testDatabaseConnection } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DatabaseConnectionTest() {
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await testDatabaseConnection();
      setStatus('success');
      setMessage(result.message);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to the database. Make sure the backend server is running.');
      console.error('Database connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Test Database Connection</h3>
      
      <Button 
        onClick={testConnection} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </Button>
      
      {status === 'success' && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">{message}</AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Make sure to:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Start your MySQL database server</li>
          <li>Run the backend server using <code>node server/index.js</code></li>
          <li>Set up your database tables using <code>node server/setup-database.js</code></li>
        </ol>
      </div>
    </div>
  );
}
