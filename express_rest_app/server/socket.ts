import http from 'http';
import { Server as IOServer } from 'socket.io';

let io: IOServer;
export default {
  init(httpServer: http.Server) {
    io = new IOServer(httpServer, {
      cors: {
        origin: '*',
      },
    });

    return io;
  },
  get io() {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }

    return io;
  },
};
