

import { io } from 'socket.io-client';

let socketInstance = null;

export const connectSocket = () => {
  if (!socketInstance) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    
    socketInstance = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling'], // Fallback transports
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      
      // Dispatch socket auth error event
      const event = new CustomEvent('socket-auth-error', {
        detail: { 
          message: 'Real-time connection failed. Please refresh and login again.' 
        }
      });
      window.dispatchEvent(event);
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected the socket, try to reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });
  }

  if (!socketInstance.connected) {
    socketInstance.connect();
  }

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const getSocket = () => {
  return socketInstance;
};

export { socketInstance as socket };

