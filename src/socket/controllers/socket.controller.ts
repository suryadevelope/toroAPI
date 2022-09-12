import { User } from '@/interfaces/users.interface';
import { Socket } from 'socket.io';
import userModel from '@models/users.model'
import checksecurity from '@/securitychecks/check.security';
import deviceModel from '@/models/devices.model';

class SocketController {
  private socket: Socket;
  public checks = new checksecurity();
  constructor(socket: Socket) {
    this.socket = socket;
    var { origin } = socket.handshake.headers;
    socket.on('disconnect', this.disconnect);
    socket.on("delete_user", this.delete_user);
    socket.on("update_user", this.update_user);
  }

  private update_user = async (data: { token: String, data: User }, callback: any) => {

    var checksdata = this.checks.check(data.token);
    if (checksdata.code == 200) {
      console.log(this.socket.data.user.uid);
      if (data.data.mail) {
        delete data.data.mail
      }
      if (data.data.uid) {
        delete data.data.uid
      }

      await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (res) => {
        if (res) {
          await userModel.updateOne({ uid: this.socket.data.user.uid }, data.data);
          callback('USER_UPDATED');
        } else {
          callback({ "code": 404, "Reason": "No user exists" })
        }

      }).catch((err) => {
        callback(err);
      })
    } else {
      callback({ "code": 401, "Reason": "Access denied" })

    }


  }

  private delete_user = async (callback: any) => {
    await userModel.findOne({ uid: this.socket.data.user.uid }).then(async (res) => {

      if (res) {
        // await userModel.deleteOne({uid: this.socket.data.uid });
        callback(null, 'USER_DELETED');

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
