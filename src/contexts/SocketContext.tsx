
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Connect to socket server
    const socketInstance = io('http://localhost:8080', {
      auth: { token },
      transports: ['websocket'],
    });
    
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });
    
    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to messaging service',
        variant: 'destructive',
      });
      setIsConnected(false);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, [toast]);
  
  const joinRoom = (room: string) => {
    if (socket) {
      socket.emit('join', room);
    }
  };
  
  const leaveRoom = (room: string) => {
    if (socket) {
      socket.emit('leave', room);
    }
  };
  
  return (
    <SocketContext.Provider value={{ socket, isConnected, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
