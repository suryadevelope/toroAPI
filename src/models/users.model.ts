import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  affliate: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  devices: {
    type: Array,
    default: []
  },
  uid: {
    type: String,
    required: false
  }
  
});

const userModel = model<User & Document>('Users', userSchema);

export default userModel;
