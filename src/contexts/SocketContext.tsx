
import React, { createContext, useContext } from 'react';

// Create a minimal placeholder context to prevent breaking other components
interface SocketContextType {
  socket: null;
  joinRoom: () => void;
  leaveRoom: () => void;
}

const defaultContext: SocketContextType = {
  socket: null,
  joinRoom: () => {},
  leaveRoom: () => {},
};

const SocketContext = createContext<SocketContextType>(defaultContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SocketContext.Provider value={defaultContext}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
