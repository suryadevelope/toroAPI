import { User } from '@/interfaces/users.interface';
import { Socket } from 'socket.io';
import userModel from '@models/users.model'

class SocketController {
  private socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
    var { origin } = socket.handshake.headers;
    socket.on('disconnect', this.disconnect);
    socket.on("delete_user", this.delete_user);
  }
 

  private delete_user = async (callback: any) => {
    await userModel.findOne({ uid: this.socket.data.uid}).then(async (res) => {
      
      if (res) {
        await userModel.deleteOne({uid: this.socket.data.uid });
        callback(null, 'User deleted');

      } else {
        callback({ "code": 404, "Reason": "No user exists" })
      }

    }).catch((err) => {
      callback(err);
    })

  }

  private disconnect = (reason: string) => {
    console.info(`Socket disconnected: ${this.socket.id}, reason: ` + reason);
  };
}

export default SocketController;
