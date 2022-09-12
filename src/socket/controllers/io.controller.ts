import deviceModel from '@/models/devices.model';
import { Socket, Server } from 'socket.io';
import IoAuthMiddleware from '../middlewares/io.auth.middleware';
import DeviceController from './devices.controller';
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
    new DeviceController(socket);
  };

  

}

export default IO;
