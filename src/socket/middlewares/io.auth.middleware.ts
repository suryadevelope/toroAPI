import userModel from '@/models/users.model';
import { Socket } from 'socket.io';

const authMiddleware = async (socket: Socket, next: any) => {
  try {
    var uid = socket.handshake.auth.token;
    var { origin } = socket.handshake.headers;



    next();// all ok go further
   
  } catch (err) {
    next(new Error(err.message));
  }
};
// @ts-ignore - grammarly
export default authMiddleware;
