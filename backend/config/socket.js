const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.user = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.user.id);
    
    // Join user's personal room
    socket.join(`user:${socket.user.id}`);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.user.id);
    });
  });

  return io;
};

module.exports = initializeSocket; 