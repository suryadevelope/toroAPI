import { Socket, Server } from 'socket.io';
import IoAuthMiddleware from '../middlewares/io.auth.middleware';
import SocketController from './socket.controller';
class IO {
  public io: Server;
  constructor(io: Server) {
    this.io = io;
    io.use(IoAuthMiddleware);
    io.on('connection', this.connection);
  }
  private connection = (socket: Socket) => {
   console.log(`Socket connected: ${socket.id}`);
    new SocketController(socket);
  };
}

export default IO;
