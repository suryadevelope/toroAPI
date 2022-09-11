import { Socket } from 'socket.io';

class SocketController {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
    var { origin } = socket.handshake.headers;
    socket.on('disconnect', this.disconnect);
  }
  private disconnect = (reason: string) => {
    console.info(`Socket disconnected: ${this.socket.id}, email: ${this.socket.data.user.email}, reason: ` + reason);
  };
}

export default SocketController;
