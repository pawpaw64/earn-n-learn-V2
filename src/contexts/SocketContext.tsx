
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the socket context interface
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string | number) => void;
  leaveRoom: (roomId: string | number) => void;
  sendMessage: (data: any) => void;
  listenForMessages: (callback: (data: any) => void) => void;
  stopListeningForMessages: () => void;
}

// Create the context with default values
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  leaveRoom: () => {},
  sendMessage: () => {},
  listenForMessages: () => {},
  stopListeningForMessages: () => {}
});

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const socketInstance = io('http://localhost:8080');

    // Set up event listeners
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Save socket instance
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      console.log('Disconnecting socket');
      socketInstance.disconnect();
    };
  }, []);

  // Join a room
  const joinRoom = useCallback((roomId: string | number) => {
    if (socket && isConnected) {
      console.log('Joining room:', roomId);
      socket.emit('join_room', roomId);
    }
  }, [socket, isConnected]);

  // Leave a room
  const leaveRoom = useCallback((roomId: string | number) => {
    if (socket && isConnected) {
      console.log('Leaving room:', roomId);
      socket.emit('leave_room', roomId);
    }
  }, [socket, isConnected]);

  // Send a message
  const sendMessage = useCallback((data: any) => {
    if (socket && isConnected) {
      console.log('Sending message:', data);
      socket.emit('send_message', data);
    }
  }, [socket, isConnected]);

  // Listen for messages
  const listenForMessages = useCallback((callback: (data: any) => void) => {
    if (socket) {
      console.log('Setting up message listener');
      socket.on('receive_message', callback);
    }
  }, [socket]);

  // Stop listening for messages
  const stopListeningForMessages = useCallback(() => {
    if (socket) {
      console.log('Removing message listener');
      socket.off('receive_message');
    }
  }, [socket]);

  // Context value
  const value = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    listenForMessages,
    stopListeningForMessages
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
