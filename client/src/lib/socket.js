import { io } from 'socket.io-client';

let socket = null;
const listeners = new Map();
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Connect to WebSocket server
 */
export function connectSocket(token) {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  const url = import.meta.env.PROD ? '' : 'http://localhost:3000';

  socket = io(url, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('WebSocket connected:', socket.id);
    reconnectAttempts = 0;
    notifyListeners('connection', { connected: true, socketId: socket.id });
  });

  socket.on('disconnect', (reason) => {
    console.log('WebSocket disconnected:', reason);
    notifyListeners('connection', { connected: false, reason });
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error.message);
    reconnectAttempts++;
    notifyListeners('connection', { connected: false, error: error.message });
  });

  // Server confirmation
  socket.on('connected', (data) => {
    console.log('Server confirmed connection:', data);
  });

  // Notification events
  socket.on('notification', (notification) => {
    console.log('Received notification:', notification);
    notifyListeners('notification', notification);
  });

  // Message events
  socket.on('message', (message) => {
    notifyListeners('message', message);
  });

  // Typing indicators
  socket.on('typing:user', (data) => {
    notifyListeners('typing', data);
  });

  // Pong for latency measurement
  socket.on('pong', (data) => {
    const latency = Date.now() - data.timestamp;
    notifyListeners('latency', { latency });
  });

  // Generic error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    notifyListeners('error', error);
  });

  return socket;
}

/**
 * Disconnect from WebSocket server
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    listeners.clear();
    console.log('WebSocket disconnected');
  }
}

/**
 * Check if socket is connected
 */
export function isConnected() {
  return socket?.connected || false;
}

/**
 * Get current socket instance
 */
export function getSocket() {
  return socket;
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Add event listener
 */
export function addListener(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(callback);

  // Return unsubscribe function
  return () => {
    listeners.get(event)?.delete(callback);
  };
}

/**
 * Remove event listener
 */
export function removeListener(event, callback) {
  listeners.get(event)?.delete(callback);
}

/**
 * Notify all listeners for an event
 */
function notifyListeners(event, data) {
  const eventListeners = listeners.get(event);
  if (eventListeners) {
    eventListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }
}

// ============================================
// CONVENIENCE METHODS
// ============================================

/**
 * Listen for notifications
 */
export function onNotification(callback) {
  return addListener('notification', callback);
}

/**
 * Listen for messages
 */
export function onMessage(callback) {
  return addListener('message', callback);
}

/**
 * Listen for typing indicators
 */
export function onTyping(callback) {
  return addListener('typing', callback);
}

/**
 * Listen for connection state changes
 */
export function onConnectionChange(callback) {
  return addListener('connection', callback);
}

// ============================================
// SOCKET ACTIONS
// ============================================

/**
 * Mark notification as read
 */
export function markNotificationRead(notificationId) {
  socket?.emit('notification:read', notificationId);
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsRead() {
  socket?.emit('notifications:read-all');
}

/**
 * Join a conversation room
 */
export function joinConversation(conversationId) {
  socket?.emit('conversation:join', conversationId);
}

/**
 * Leave a conversation room
 */
export function leaveConversation(conversationId) {
  socket?.emit('conversation:leave', conversationId);
}

/**
 * Start typing indicator
 */
export function startTyping(conversationId) {
  socket?.emit('typing:start', conversationId);
}

/**
 * Stop typing indicator
 */
export function stopTyping(conversationId) {
  socket?.emit('typing:stop', conversationId);
}

/**
 * Ping server (for latency measurement)
 */
export function ping() {
  socket?.emit('ping');
}

export default {
  connectSocket,
  disconnectSocket,
  isConnected,
  getSocket,
  addListener,
  removeListener,
  onNotification,
  onMessage,
  onTyping,
  onConnectionChange,
  markNotificationRead,
  markAllNotificationsRead,
  joinConversation,
  leaveConversation,
  startTyping,
  stopTyping,
  ping,
};
