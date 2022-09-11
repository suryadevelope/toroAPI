import userModel from '@/models/users.model';
import { Socket } from 'socket.io';

const authMiddleware = async (socket: Socket, next: any) => {
  try {
    var uid = socket.handshake.auth.token;
    var { origin } = socket.handshake.headers;
    if (uid && uid.trim().length > 0) {
    userModel
    .findOne({ uid })
    .then(user => {
      if (user) {
          socket.data = {
            user,
          };
          next();// all ok go further

        } else {
          next(new Error('UNAUTHORIZED_ACCESS'));
        }
      
    }).catch((err)=>{
      next(new Error(err.message));
    })
  }else{
    next(new Error('TOKEN_MISSING'));
  }
  } catch (err) {
    next(new Error(err.message));
  }
};
// @ts-ignore - grammarly
export default authMiddleware;
