const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;
const userSockets = new Map(); // userId -> Set of socket ids
const socketUsers = new Map(); // socketId -> userId

/**
 * Initialize WebSocket server
 */
function initializeWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? [
            'https://formativeunites.us',
            'https://www.formativeunites.us',
            'https://chic-patience-production.up.railway.app'
          ]
        : '*',
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    console.log(`WebSocket: User ${userId} connected (socket: ${socket.id})`);

    // Track socket connection
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);
    socketUsers.set(socket.id, userId);

    // Join user's personal room for targeted notifications
    socket.join(`user:${userId}`);

    // Send connection confirmation
    socket.emit('connected', {
      userId,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`WebSocket: User ${userId} disconnected (${reason})`);

      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }
      socketUsers.delete(socket.id);
    });

    // Mark notification as read
    socket.on('notification:read', async (notificationId) => {
      try {
        // This will be handled by the notification routes
        // Just emit confirmation
        socket.emit('notification:read:confirmed', { notificationId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark notification as read' });
      }
    });

    // Mark all notifications as read
    socket.on('notifications:read-all', async () => {
      try {
        socket.emit('notifications:read-all:confirmed', { timestamp: new Date().toISOString() });
      } catch (error) {
        socket.emit('error', { message: 'Failed to mark notifications as read' });
      }
    });

    // Join a conversation room for real-time messaging
    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing indicators
    socket.on('typing:start', (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit('typing:user', {
        userId,
        conversationId,
        typing: true
      });
    });

    socket.on('typing:stop', (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit('typing:user', {
        userId,
        conversationId,
        typing: false
      });
    });

    // Ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
  });

  console.log('WebSocket server initialized');
  return io;
}

/**
 * Emit event to a specific user (all their connected devices)
 */
function emitToUser(userId, event, data) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    return true;
  }
  return false;
}

/**
 * Emit notification to a user
 */
function emitNotification(userId, notification) {
  return emitToUser(userId, 'notification', notification);
}

/**
 * Emit event to all participants in a conversation
 */
function emitToConversation(conversationId, event, data) {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
    return true;
  }
  return false;
}

/**
 * Emit a new message to a conversation
 */
function emitMessage(conversationId, message) {
  return emitToConversation(conversationId, 'message', message);
}

/**
 * Emit event to multiple users
 */
function emitToUsers(userIds, event, data) {
  if (io && Array.isArray(userIds)) {
    userIds.forEach(userId => {
      io.to(`user:${userId}`).emit(event, data);
    });
    return true;
  }
  return false;
}

/**
 * Broadcast to all connected clients
 */
function broadcast(event, data) {
  if (io) {
    io.emit(event, data);
    return true;
  }
  return false;
}

/**
 * Check if a user is currently online
 */
function isUserOnline(userId) {
  return userSockets.has(userId) && userSockets.get(userId).size > 0;
}

/**
 * Get list of online users
 */
function getOnlineUsers() {
  return Array.from(userSockets.keys());
}

/**
 * Get count of connected sockets for a user
 */
function getUserConnectionCount(userId) {
  const sockets = userSockets.get(userId);
  return sockets ? sockets.size : 0;
}

/**
 * Get total connected clients
 */
function getTotalConnections() {
  return socketUsers.size;
}

/**
 * Get Socket.io instance
 */
function getIO() {
  return io;
}

module.exports = {
  initializeWebSocket,
  emitToUser,
  emitNotification,
  emitToConversation,
  emitMessage,
  emitToUsers,
  broadcast,
  isUserOnline,
  getOnlineUsers,
  getUserConnectionCount,
  getTotalConnections,
  getIO,
};
